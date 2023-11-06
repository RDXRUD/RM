using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore; // Import the Entity Framework Core namespace
using Microsoft.CodeAnalysis.Rename;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
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

        [HttpGet]
        [Route("Dates")]
        public ActionResult<IEnumerable<DateMaster>> GetDates()
        {
            
            return _dbContext.date_master;
            //return datesWithDays;
        }

        [HttpPost]
        [Route("CrossViewData")]
        public ActionResult<IEnumerable<CrossTabResult>> GetDates([FromBody] FilterViewModel filterData)
        {
            if (filterData.startDate > filterData.endDate)
            {
                return BadRequest("Invalid date range. Start date should be before end date.");
            }

            _dbContext.Database.ExecuteSqlRaw("DELETE FROM date_master");
            _dbContext.Database.ExecuteSqlRaw("SELECT setval('date_master_id_seq', 1, false)");
            _dbContext.Database.ExecuteSqlRaw("DELETE FROM cross_view_data");
            _dbContext.Database.ExecuteSqlRaw("SELECT setval('cross_view_data_id_seq', 1, false)");
            _dbContext.Database.ExecuteSqlRaw("DELETE FROM cross_view_join");
            _dbContext.Database.ExecuteSqlRaw("SELECT setval('cross_view_join_id_seq', 1, false)");


            var datesWithDays = new List<DateMaster>();

            for (DateTime date = filterData.startDate.Date; date <= filterData.endDate.Date; date = date.AddDays(1))
            {
                var model = new DateMaster
                {
                    date = date,
                    day = date.ToString("dddd")
                };

                datesWithDays.Add(model);
                _dbContext.date_master.Add(model);
            }
            _dbContext.SaveChanges();

            var locResIds = _dbContext.resource_master
            .Where(rm => rm.location_id == filterData.location)
            .Select(resource => resource.res_id)
            .ToList();
            

            var skillResIds = _dbContext.resource_skill
                .Where(ss => ss.SkillSetID == filterData.skillSetID)
                .Select(resource => resource.res_id)
                .ToList();

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
            //var resIds = _dbContext.resource_master.Select(resource => resource.res_id).ToList();
            var dateIds = _dbContext.date_master.Select(date => date.date_id).ToList();

            var crossViewDataList = resIds
                .SelectMany(resId => dateIds, (resId, dateId) => new CrossViewData
                {
                    id = 0, // Set an initial value here
                    res_id = resId,
                    date_id = dateId,
                    allocation_perc = 0 // Set an initial allocation value here
                })
                .ToList();

            _dbContext.cross_view_data.AddRange(crossViewDataList);
            _dbContext.SaveChanges();

            var joinQuery = from rm in _dbContext.resource_master
                            join cvd in _dbContext.cross_view_data on rm.res_id equals cvd.res_id
                            join dm in _dbContext.date_master on cvd.date_id equals dm.date_id
                            join pra in _dbContext.project_res_allocation on cvd.res_id equals pra.res_id into allocationGroup
                            from allocation in allocationGroup.DefaultIfEmpty() // Left join
                            where ((allocation.start_date <= dm.date && allocation.end_date >= dm.date))
                            group allocation by new { rm.res_name,rm.res_email_id, cvd.res_id, dm.date, dm.day } into grouped
                            select new CrossJoin
                            {
                                res_name = grouped.Key.res_name,
                                res_email_id=grouped.Key.res_email_id,
                                allocation_perc = grouped.Key.day == "Saturday" || grouped.Key.day == "Sunday"
                                    ? -1 // Set allocation_perc to -1 for Saturday and Sunday
                                    : grouped.Sum(p => p.allocation_perc),
                                date = grouped.Key.date,
                                day = grouped.Key.day
                            };

            var tempQuery = from rm in _dbContext.resource_master
                            join cvd in _dbContext.cross_view_data on rm.res_id equals cvd.res_id
                            join dm in _dbContext.date_master on cvd.date_id equals dm.date_id
                            join pra in _dbContext.project_res_allocation on cvd.res_id equals pra.res_id into allocationGroup
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

            _dbContext.cross_view_join.AddRange(combinedQuery);
            _dbContext.SaveChanges();

            var data = _dbContext.cross_view_join.ToList();

            var groupedData = data.GroupBy(d => new { d.res_name, d.res_email_id });

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

            return crosstab;

            //    var crosstab = data
            //.GroupBy(d => new { d.res_name, d.date })
            //.Select(g => new CrossTabResult
            //{
            //    res_name = g.Key.res_name,
            //    allocationData = g.GroupBy(d => d.date).ToDictionary(
            //        group => group.Key,
            //        group => group.Sum(item => item.allocation_perc)
            //    )
            //})
            //.OrderBy(c => c.res_name) // Sort by ResName
            //.ToList();

            //    return crosstab;
            //return datesWithDays;
        }
    }
}
