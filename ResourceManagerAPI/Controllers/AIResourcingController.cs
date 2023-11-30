using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using Microsoft.EntityFrameworkCore;
using com.sun.org.apache.xpath.@internal.operations;
using System.Linq;
using org.apache.commons.math3.stat.descriptive.summary;
using System.Globalization;
using System.Data;
using java.time.temporal;

namespace ResourceManagerAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AIResourcingController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public AIResourcingController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        private static List<DateMaster> dateMasterList = new List<DateMaster>();
        private static List<WeekMaster> weekMasterList = new List<WeekMaster>();
        private static List<MonthMaster> monthMasterList = new List<MonthMaster>();
        private static List<QuarterMaster> quarterMasterList = new List<QuarterMaster>();
        private static List<YearMaster> yearMasterList = new List<YearMaster>();

        private static List<MonthlyAIResult> monthlyCrossTab = new List<MonthlyAIResult>();
        private static List<QuarterlyAIResult> quarterlyCrossTab = new List<QuarterlyAIResult>();
        private static List<YearlyAIResult> yearlyCrossTab = new List<YearlyAIResult>();
        private static List<WeeklyAIResult> weeklyCrossTab = new List<WeeklyAIResult>();

        [HttpPost,Authorize]
        [Route("AIResourceData")]
        public ActionResult<IEnumerable<CustomResult>> GetData([FromBody] AIModel filterData)
        {


            if (filterData.startDate > filterData.endDate)
            {
                return BadRequest("Invalid date range. Start date should be before end date.");
            }

            dateMasterList.Clear();
            weekMasterList.Clear();
            monthMasterList.Clear();
            quarterMasterList.Clear();
            yearMasterList.Clear();



            List<CrossViewData> cross_view_data = new List<CrossViewData>();
            List<CrossAIJoin> cross_view_join = new List<CrossAIJoin>();

            List<CustomResult> customCrossTab = new List<CustomResult>();

            cross_view_data.Clear();
            cross_view_join.Clear();

            var resourceMaster = _dbContext.resource_master.ToList();
            var resource_skill = _dbContext.resource_skill;
            var project_res_allocation = _dbContext.project_res_allocation.ToList();
            var skill_group = _dbContext.skill_group.ToList();
            var skill_set = _dbContext.skill_set.ToList();
            var _skill= _dbContext._skill.ToList();


            for (DateTime date = filterData.startDate.Date; date <= filterData.endDate.Date; date = date.AddDays(1))
            {
                var model = new DateMaster
                {
                    date = date,
                    day = date.ToString("dddd")
                };

                dateMasterList.Add(model);
            }
            

            var skillResIds = resource_skill
                .Where(ss => filterData.skillSetID.Contains(ss.SkillSetID))
                .Select(resource => resource.res_id)
                .ToList();

            if (filterData.location.Length!=0)
            {
                var locResIds = resourceMaster
                .Where(rm => filterData.location.Contains(rm.location_id))
                .Select(resource => resource.res_id)
                .ToList();

                skillResIds = locResIds.Intersect(skillResIds).ToList();
            }

            var resIds = skillResIds.ToList();
            if (resIds.Count == 0)
            {
                return StatusCode(502, "No Records Found");
            }

            var dateIds = dateMasterList.Select(date => date.date_id).ToList();

            var crossViewDataList = resIds
                .SelectMany(resId => dateIds, (resId, dateId) => new CrossViewData
                {
                    id = 0, // initial value 
                    res_id = resId,
                    date_id = dateId,
                    allocation_perc = 0 // initial allocation value 
                })
                .ToList();

            cross_view_data.AddRange(crossViewDataList);

            var joinQuery = from rm in resourceMaster
                            join cvd in cross_view_data on rm.res_id equals cvd.res_id
                            join dm in dateMasterList on cvd.date_id equals dm.date_id
                            join pra in project_res_allocation on cvd.res_id equals pra.res_id
                            join rs in resource_skill on cvd.res_id equals rs.res_id
                            join ss in skill_set on rs.SkillSetID equals ss.SkillSetID
                            join sg in skill_group on ss.SkillGroupID equals sg.SkillGroupID
                            join s in _skill on ss.SkillID equals s.SkillID
                            where (pra.start_date <= dm.date && pra.end_date >= dm.date)
                            group new { rm, cvd, dm, pra, rs, ss, sg, s } by new { rm.res_name, rm.res_email_id, cvd.res_id, dm.date, dm.day, pra.allocation_perc } into grouped
                            select new CrossAIJoin
                            {
                                res_id = grouped.Key.res_id,
                                res_name = grouped.Key.res_name,
                                res_email_id = grouped.Key.res_email_id,
                                allocation_perc = grouped.Key.day == "Saturday" || grouped.Key.day == "Sunday" ? -1 : grouped.Key.allocation_perc,
                                date = grouped.Key.date,
                                day = grouped.Key.day,
                                skill_id = grouped.Select(x => x.s.SkillID).FirstOrDefault(),
                                skill = grouped.Select(x => x.s.Skill).FirstOrDefault(),
                                skill_group_id = grouped.Select(x => x.sg.SkillGroupID).FirstOrDefault()
                            };

            var tempQuery = from rm in resourceMaster
                            join cvd in cross_view_data on rm.res_id equals cvd.res_id
                            join dm in dateMasterList on cvd.date_id equals dm.date_id
                            join pra in project_res_allocation on cvd.res_id equals pra.res_id into allocationGroup
                            join rs in resource_skill on cvd.res_id equals rs.res_id
                            join ss in skill_set on rs.SkillSetID equals ss.SkillSetID
                            join sg in skill_group on ss.SkillGroupID equals sg.SkillGroupID
                            join s in _skill on ss.SkillID equals s.SkillID
                            from allocation in allocationGroup.DefaultIfEmpty() // Left join
                            select new CrossAIJoin
                            {
                                res_id=rm.res_id,
                                res_name = rm.res_name,
                                res_email_id = rm.res_email_id,
                                allocation_perc = (dm.day == "Saturday" || dm.day == "Sunday") ? -1 : cvd.allocation_perc,
                                date = dm.date,
                                day = dm.day,
                                skill_id = ss.SkillID,
                                skill = s.Skill,
                                skill_group_id = sg.SkillGroupID
                            };


            var combinedQuery = joinQuery.Union(tempQuery);

            cross_view_join.AddRange(combinedQuery);
            _dbContext.SaveChanges();

            var data = cross_view_join.ToList();

            var groupedData = data.GroupBy(d => new { d.res_id,d.res_name, d.res_email_id })
                                  .OrderBy(g => g.Key.res_name)
                                  .ThenBy(g => g.Key.res_email_id);

            var crosstab = new List<CrossTabAIResult>();

            foreach (var group in groupedData)
            {
                var resID = group.Key.res_id;
                var resName = group.Key.res_name;
                var resEmailId = group.Key.res_email_id;
                var allocationData = group.GroupBy(item => item.date)
                    .ToDictionary(
                        dateGroup => dateGroup.Key,
                        dateGroup => dateGroup.Sum(item => item.allocation_perc)
                    );

                crosstab.Add(new CrossTabAIResult
                {
                    res_id= resID,
                    res_name = resName,
                    res_email_id = resEmailId,
                    allocationData = allocationData,

                });
            }

            customCrossTab = crosstab.Select(obj =>
            {
                var resID = obj.res_id;
                var resName = obj.res_name;
                var resEmailId = obj.res_email_id;

                var allocationData = obj.allocationData
                .Where(item => item.Value >= 0)  // Filter out negative values
                .Select(item => item.Value)      // Select only the Value property
                .Average();

                return new CustomResult
                {
                    res_id=resID,
                    res_name = resName,
                    res_email_id = resEmailId,
                    allocationData = allocationData,
                    availableData=1-allocationData>=0? 1 - allocationData:0
                };

            }).OrderByDescending(result => result.availableData).ToList();

            if (filterData.report_type == "Month")
            {
                for (DateTime date = filterData.startDate; date <= filterData.endDate; date = date.AddMonths(1))
                {
                    var model = new MonthMaster
                    {
                        monthData = date.Year + "-" + date.Month
                    };

                    monthMasterList.Add(model);
                }

                monthlyCrossTab = crosstab.Select(obj =>
                {
                    var resID = obj.res_id;
                    var resName = obj.res_name;
                    var resEmailId = obj.res_email_id;

                    var allocationData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year, month = item.Key.Month })
                        .ToDictionary(
                            dataGroup => dataGroup.Key.year + "-" + dataGroup.Key.month,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                return count > 0 ? sum / count : 0;  // Avoid division by zero
                            }
                        );
                    var availableData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year, month = item.Key.Month })
                        .ToDictionary(
                            dataGroup => dataGroup.Key.year + "-" + dataGroup.Key.month,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                var val= count > 0 ? sum / count : 0;  // Avoid division by zero
                                return  1 - val >= 0 ? 1 - val : 0;
                            }
                        );

                    return new MonthlyAIResult
                    {
                        res_id=resID,
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData,
                        availableData = availableData
                    };

                }).OrderByDescending(result => result.availableData.Values.Sum()).ToList();

                

            }

            if (filterData.report_type == "Quarter")
            {
                for (DateTime date = filterData.startDate; date <= filterData.endDate; date = date.AddMonths(3))
                {
                    var model = new QuarterMaster
                    {
                        quarterData = "Q" + ((date.Month - 1) / 3 + 1) + "-" + date.Year
                    };

                    quarterMasterList.Add(model);
                }
                quarterlyCrossTab = crosstab.Select(obj =>
                {
                    var resID = obj.res_id;
                    var resName = obj.res_name;
                    var resEmailId = obj.res_email_id;

                    var allocationData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year, quarter = (item.Key.Month - 1) / 3 + 1 })
                    .ToDictionary(
                            dataGroup => ("Q" + ((dataGroup.Key.quarter) + "-" + dataGroup.Key.year)),
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                return count > 0 ? sum / count : 0;  // Avoid division by zero
                            }
                        );
                    var availableData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year, quarter = (item.Key.Month - 1) / 3 + 1 })
                    .ToDictionary(
                            dataGroup => ("Q" + ((dataGroup.Key.quarter) + "-" + dataGroup.Key.year)),
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                var val = count > 0 ? sum / count : 0;  // Avoid division by zero
                                return 1 - val >= 0 ? 1 - val : 0;
                            }
                        );

                    return new QuarterlyAIResult
                    {
                        res_id = resID,
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData,
                        availableData= availableData,
                    };

                }).OrderByDescending(result => result.availableData.Values.Sum()).ToList();
            }

            if (filterData.report_type == "Year")
            {
                for (int year = filterData.startDate.Year; year <= filterData.endDate.Year; year++)
                {
                    var model = new YearMaster
                    {
                        year = year.ToString()
                    };

                    yearMasterList.Add(model);
                }

                yearlyCrossTab = crosstab.Select(obj =>
                {
                    var resID = obj.res_id;

                    var resName = obj.res_name;
                    var resEmailId = obj.res_email_id;

                    var allocationData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year })
                        .ToDictionary(
                            dataGroup => dataGroup.Key.year,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                return count > 0 ? sum / count : 0;  // Avoid division by zero
                            }
                        );
                    var availableData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item => new { year = item.Key.Year })
                        .ToDictionary(
                            dataGroup => dataGroup.Key.year,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                var val = count > 0 ? sum / count : 0;  // Avoid division by zero
                                return 1 - val >= 0 ? 1 - val : 0;
                            }
                        );

                    return new YearlyAIResult
                    {
                        res_id = resID,
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData,
                        availableData=availableData,
                    };

                }).OrderByDescending(result => result.availableData.Values.Sum()).ToList();
            }
            if (filterData.report_type == "Week")
            {

                for (DateTime date = filterData.startDate; date <= filterData.endDate; date = date.AddDays(7))
                {
                    var weekStartDate = date.Date;
                    var weekEndDate = date.AddDays(4).Date;

                    var model = new WeekMaster
                    {
                        weekData = $"{weekStartDate:dd-MMM-yyyy} - {weekEndDate:dd-MMM-yyyy}"
                    };

                    weekMasterList.Add(model);
                }
                weeklyCrossTab = crosstab.Select(obj =>
                {
                    var resID = obj.res_id;

                    var resName = obj.res_name;
                    var resEmailId = obj.res_email_id;

                    var allocationData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item =>
                        {
                            // Determine the start date of the 5-day interval
                            var startDate = (item.Key.Date.AddDays(-(int)item.Key.DayOfWeek + (int)DayOfWeek.Monday)).Date; // Start from Monday

                            // Determine the end date by adding 4 days to the start date
                            var endDate = startDate.AddDays(4).Date;

                            return $"{startDate:dd-MMM-yyyy} - {endDate:dd-MMM-yyyy}";
                        })
                        .ToDictionary(
                            dataGroup => dataGroup.Key,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                return count > 0 ? sum / count : 0;  // Avoid division by zero
                            }
                        );
                    var availableData = obj.allocationData
                        .Where(item => item.Value >= 0)  // Filter out negative values
                        .GroupBy(item =>
                        {
                            // Determine the start date of the 5-day interval
                            var startDate = (item.Key.Date.AddDays(-(int)item.Key.DayOfWeek + (int)DayOfWeek.Monday)).Date; // Start from Monday

                            // Determine the end date by adding 4 days to the start date
                            var endDate = startDate.AddDays(4).Date;

                            return $"{startDate:dd-MMM-yyyy} - {endDate:dd-MMM-yyyy}";
                        })
                        .ToDictionary(
                            dataGroup => dataGroup.Key,
                            dataGroup =>
                            {
                                var sum = dataGroup.Sum(item => item.Value);
                                var count = dataGroup.Count();
                                var val = count > 0 ? sum / count : 0;  // Avoid division by zero
                                return 1 - val >= 0 ? 1 - val : 0;
                            }
                        );

                    return new WeeklyAIResult
                    {
                        res_id = resID,
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData,
                        availableData= availableData
                    };

                }).OrderByDescending(result => result.availableData.Values.Sum()).ToList();
            }

            return customCrossTab;

        }

        //[HttpGet, Authorize]
        //[Route("Dates")]
        //public ActionResult<IEnumerable<DateMaster>> GetDates()
        //{
        //    return dateMasterList;
        //}
        [HttpGet, Authorize]
        [Route("Weeks")]
        public ActionResult<IEnumerable<WeekMaster>> GetWeeks()
        {
            return weekMasterList;
        }

        [HttpGet, Authorize]
        [Route("WeeklyCrossAITab")]
        public ActionResult<IEnumerable<WeeklyAIResult>> GeWeeklyData()
        {
            return weeklyCrossTab;
        }
        [HttpGet, Authorize]
        [Route("Months")]
        public ActionResult<IEnumerable<MonthMaster>> GetMonths()
        {
            return monthMasterList;
        }

        [HttpGet]
        [Route("MonthlyCrossAITab")]
        public ActionResult<IEnumerable<MonthlyAIResult>> GetMonthlyData()
        {
            return monthlyCrossTab;
        }
        [HttpGet, Authorize]
        [Route("Quaters")]
        public ActionResult<IEnumerable<QuarterMaster>> GetQuarters()
        {
            return quarterMasterList;
        }

        [HttpGet, Authorize]
        [Route("QuarterlyCrossAITab")]
        public ActionResult<IEnumerable<QuarterlyAIResult>> GetQuarterlyData()
        {
            return quarterlyCrossTab;
        }
        [HttpGet, Authorize]
        [Route("Years")]
        public ActionResult<IEnumerable<YearMaster>> GetYears()
        {
            return yearMasterList;
        }

        [HttpGet, Authorize]
        [Route("YearlyCrossAITab")]
        public ActionResult<IEnumerable<YearlyAIResult>> GetYearlyData()
        {
            return yearlyCrossTab;
        }
    }
}
