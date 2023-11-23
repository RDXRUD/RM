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
    public class CrossViewController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public CrossViewController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        private static List<DateMaster> dateMasterList = new List<DateMaster>();
        private static List<WeekMaster> weekMasterList = new List<WeekMaster>();
        private static List<MonthMaster> monthMasterList = new List<MonthMaster>();
        private static List<QuarterMaster> quarterMasterList = new List<QuarterMaster>();
        private static List<YearMaster> yearMasterList = new List<YearMaster>();

        private static List<MonthlyResult>monthlyCrossTab=new List<MonthlyResult>();
        private static List<QuarterlyResult> quarterlyCrossTab = new List<QuarterlyResult>();
        private static List<YearlyResult> yearlyCrossTab = new List<YearlyResult>();
        private static List<WeeklyResult> weeklyCrossTab = new List<WeeklyResult>();




        [HttpPost,Authorize]
        [Route("CrossViewData")]
        public ActionResult<IEnumerable<CrossTabResult>> GetData([FromBody] FilterViewModel filterData)
        {


            if (filterData.startDate > filterData.endDate)
            {
                return BadRequest("Invalid date range. Start date should be before end date.");
            }

            dateMasterList.Clear();



             List<CrossViewData> cross_view_data = new List<CrossViewData>();
             List<CrossJoin> cross_view_join = new List<CrossJoin>();

            weekMasterList.Clear();
            monthMasterList.Clear();
            quarterMasterList.Clear();
            yearMasterList.Clear();

            cross_view_data.Clear();
            cross_view_join.Clear();

            var resourceMaster = _dbContext.resource_master.ToList();
            var resource_skill = _dbContext.resource_skill;
            var project_res_allocation=_dbContext.project_res_allocation.ToList();
            var skill_group= _dbContext.skill_group.ToList();
            var skill_set= _dbContext.skill_set.ToList();


            for (DateTime date = filterData.startDate.Date; date <= filterData.endDate.Date; date = date.AddDays(1))
            {
                var model = new DateMaster
                {
                    date = date,
                    day = date.ToString("dddd")
                };

                dateMasterList.Add(model);
            }

            var locResIds = resourceMaster
            .Where(rm => rm.location_id == filterData.location)
            .Select(resource => resource.res_id)
            .ToList();
            

            var skillResIds = resource_skill
                .Where(ss => filterData.skillSetID.Contains(ss.SkillSetID))
                .Select(resource => resource.res_id)
                .ToList();

            //        var skillResIds = _dbContext.resource_skill
            //.Where(ss => ss.SkillSetID == filterData.skillSetID)
            //.Join(
            //    _dbContext.skillgroup,
            //    resource => resource.SkillSetID,
            //    skillgroup => skillgroup.SkillSetID,
            //    (resource, skillgroup) => new { Resource = resource, SkillGroup = skillgroup }
            //)
            //.Select(joinResult => joinResult.Resource.res_id)
            //.ToList();

            //var groupResIds = (
            //                from rs in resource_skill
            //                join ss in skill_set on rs.SkillSetID equals ss.SkillSetID
            //                join sg in skill_group on ss.SkillGroupID equals sg.SkillGroupID
            //                where sg.SkillGroupID == filterData.skillGroupID
            //                select rs.res_id
            //            ).ToListAsync();

//            var groupResIds = (
//    from rs in resource_skill
//    join ss in skill_set on rs.SkillSetID equals ss.SkillSetID
//    where ss.SkillGroupID == filterData.skillGroupID
//    select rs.res_id
//).ToList();



            var nameResIds = filterData.res_name;

            var temp = locResIds.Union(skillResIds).Union(nameResIds ?? Enumerable.Empty<int>());

            if (filterData.location!=null)
            {
                temp = temp.Intersect(locResIds);
            }

            if (filterData.skillSetID!=null)
            {
                temp = temp.Intersect(skillResIds);
            }
            

            if (nameResIds != null && nameResIds.Any())
            {
                temp = temp.Intersect(nameResIds);
            }

            var resIds = temp.ToList();
            if(resIds.Count == 0) {
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
                            where (pra.start_date <= dm.date && pra.end_date >= dm.date)
                            group pra by new { rm.res_name, rm.res_email_id, cvd.res_id, dm.date, dm.day,pra.allocation_perc } into grouped
                            select new CrossJoin
                            {
                                res_name = grouped.Key.res_name,
                                res_email_id = grouped.Key.res_email_id,
                                allocation_perc = grouped.Key.day == "Saturday" || grouped.Key.day == "Sunday"
                                    ? -1 // Set allocation_perc to -1 for Saturday and Sunday
                                    : grouped.Key.allocation_perc,
                                date = grouped.Key.date,
                                day = grouped.Key.day
                            };

            var tempQuery = from rm in resourceMaster
                            join cvd in cross_view_data on rm.res_id equals cvd.res_id
                            join dm in dateMasterList on cvd.date_id equals dm.date_id
                            join pra in project_res_allocation on cvd.res_id equals pra.res_id into allocationGroup
                            from allocation in allocationGroup.DefaultIfEmpty() // Left join
                            select new CrossJoin
                            {
                                res_name = rm.res_name,
                                res_email_id = rm.res_email_id,
                                allocation_perc = (dm.day == "Saturday" || dm.day == "Sunday") ? -1 : cvd.allocation_perc,
                                date = dm.date,
                                day = dm.day
                            };


            var combinedQuery = joinQuery.Union(tempQuery);

            cross_view_join.AddRange(combinedQuery);
            _dbContext.SaveChanges();

            var data = cross_view_join.ToList();

            var groupedData = data.GroupBy(d => new { d.res_name, d.res_email_id })
                                  .OrderBy(g => g.Key.res_name)
                                  .ThenBy(g => g.Key.res_email_id);

            var crosstab = new List<CrossTabResult>();

            foreach (var group in groupedData)
            {
                var resName = group.Key.res_name;
                var resEmailId = group.Key.res_email_id;
                var allocationData = group.GroupBy(item => item.date)
                    .ToDictionary(
                        dateGroup => dateGroup.Key,
                        dateGroup => dateGroup.Sum(item => item.allocation_perc)
                    );

                crosstab.Add(new CrossTabResult
                {
                    res_name = resName,
                    res_email_id=resEmailId,
                    allocationData = allocationData
                });
            }

            if (filterData.report_type=="Month")
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

                    return new MonthlyResult
                    {
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData
                    };

                }).ToList();

            }

            if (filterData.report_type == "Quarter")
            {
                for (DateTime date = filterData.startDate; date <= filterData.endDate; date = date.AddMonths(3))
                {
                    var model = new QuarterMaster
                    {
                        quarterData = "Q" + ((date.Month - 1) / 3 + 1 )+ "-" + date.Year
                    };

                    quarterMasterList.Add(model);
                }
                quarterlyCrossTab = crosstab.Select(obj =>
                {
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

                    return new QuarterlyResult
                    {
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData
                    };

                }).ToList();
            }

            if(filterData.report_type == "Year")
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

                    return new YearlyResult
                    {
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData
                    };

                }).ToList();
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

                    return new WeeklyResult
                    {
                        res_name = resName,
                        res_email_id = resEmailId,
                        allocationData = allocationData
                    };

                }).ToList();
            }
                

            return crosstab; 

        }

        [HttpGet, Authorize]
        [Route("Dates")]
        public ActionResult<IEnumerable<DateMaster>> GetDates()
        {
            return dateMasterList;
        }
        [HttpGet, Authorize]
        [Route("Weeks")]
        public ActionResult<IEnumerable<WeekMaster>> GetWeeks()
        {
            return weekMasterList;
        }

        [HttpGet, Authorize]
        [Route("WeeklyCrossTab")]
        public ActionResult<IEnumerable<WeeklyResult>> GeWeeklyData()
        {
            return weeklyCrossTab;
        }
        [HttpGet, Authorize]
        [Route("Months")]
        public ActionResult<IEnumerable<MonthMaster>> GetMonths()
        {
            return monthMasterList;
        }

        [HttpGet, Authorize]
        [Route("MonthlyCrossTab")]
        public ActionResult<IEnumerable<MonthlyResult>> GetMonthlyData()
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
        [Route("QuarterlyCrossTab")]
        public ActionResult<IEnumerable<QuarterlyResult>> GetQuarterlyData()
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
        [Route("YearlyCrossTab")]
        public ActionResult<IEnumerable<YearlyResult>> GetYearlyData()
        {
            return yearlyCrossTab;
        }
    }
}
