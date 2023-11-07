﻿using com.sun.org.apache.xerces.@internal.impl.dv.xs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Collections.Immutable;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetailController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public DetailController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        [HttpPost]
        [Route("DetailView")]
        public ActionResult<IEnumerable<DetailView>> GetDates([FromBody] FilterDetail filterData)
        {


            var locResIds = _dbContext.resource_master
            .Where(rm => rm.location_id == filterData.location)
            .Select(resource => resource.res_id)
            .ToList();

            var clientResIds = (from pm in _dbContext.project_master
                                where filterData.client_name == null || filterData.client_name.Contains(pm.client_id)
                                join pra in _dbContext.project_res_allocation
                                on pm.project_id equals pra.project_id into detail
                                from m in detail.DefaultIfEmpty()
                                select m.res_id).ToList();

            var projectResIds = _dbContext.project_res_allocation
                                .Where(p => filterData.project_name == null || filterData.project_name.Contains(p.project_id))
                                .Select(res => res.res_id)
                                .ToList();

            var nameResIds = filterData.res_name;

            var temp = locResIds.Union(clientResIds).Union(nameResIds ?? Enumerable.Empty<int>()).Union(projectResIds);

            if (filterData.location != null)
            {
                temp = temp.Intersect(locResIds);
            }

            if (projectResIds != null && projectResIds.Any())
            {
                temp = temp.Intersect(projectResIds);
            }

            if (clientResIds != null && clientResIds.Any())
            {
                temp = temp.Intersect(clientResIds);
            }

            if (nameResIds != null && nameResIds.Any())
            {
                temp = temp.Intersect(nameResIds);
            }

            var resIds = temp.ToList();
            if (resIds.Count == 0)
            {
                return StatusCode(502, "No Records Found");
            }

            var query = from r in resIds
                        join rm in _dbContext.resource_master on r equals rm.res_id
                        join pra in _dbContext.project_res_allocation on rm?.res_id equals pra.res_id
                        join pm in _dbContext.project_master on pra?.project_id equals pm.project_id
                        join cm in _dbContext.client_master on pm?.client_id equals cm.client_id
                        join ss in _dbContext.skill_set on pra?.skill_id equals ss.SkillSetID
                        join sg in _dbContext.skill_group on ss?.SkillGroupID equals sg.SkillGroupID 
                        join s in _dbContext._skill on ss?.SkillID equals s.SkillID into detail
                        from m in detail.DefaultIfEmpty()
                        select new DetailView
                        {
                            res_name = rm?.res_name,
                            res_email_id = rm?.res_email_id,
                            project_name = pm.project_name != "" ? pm.project_name : "null",
                            client_name = cm.client_name != "" ? cm.client_name : "null",
                            skill = m?.Skill,
                            skillGroup = sg?.SkillGroup,
                            start_date = pra.start_date != null ? pra.start_date : new DateTime(2000, 1, 1, 0, 0, 0),
                            end_date= pra.end_date != null ? pra.end_date : new DateTime(2000, 1, 1, 0, 0, 0),

                        };
            return query.ToList();

        }

    }
}
