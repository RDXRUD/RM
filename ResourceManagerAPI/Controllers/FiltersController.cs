using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
using System.Linq;
namespace ResourceManagerAPI.Controllers
{
	[Route("[controller]")]
	[ApiController]
    public class FiltersController : Controller
    {
        private readonly PGDBContext _dbContext;
        public FiltersController(PGDBContext empContext)
        {
            _dbContext = empContext;
        }
        
        [HttpPost, Authorize]
        [Route("FilterResource")]
        public List<ResourceWithSkillCount> GetFilteredData([FromBody] filterResCount filter)
        {
            var filteredResources =(from rm in _dbContext.resource_master.Where(r =>
            (string.IsNullOrEmpty(filter.res_name) || r.res_name.ToUpper().Contains(filter.res_name.ToUpper())) &&
            (string.IsNullOrEmpty(filter.res_email_id) || r.res_email_id.ToUpper().Contains(filter.res_email_id.ToUpper()))
                &&r.status=="ACTIVE")
                                    join rs in _dbContext.resource_skill on rm.res_id equals rs.res_id into skillDetail
                                    select new ResourceWithSkillCount
                                    {
                                        res_id = rm.res_id,
                                        res_name = rm.res_name,
                                        res_email_id = rm.res_email_id,
                                        skill_count = skillDetail.Count()
                                    }).ToList();
            if (filter.skill_count.HasValue)
            {
                // Implement skill count filtering logic here
                filteredResources = (from fr in filteredResources.Where(c=>c.skill_count==filter.skill_count)
                                    select new ResourceWithSkillCount
                                    {
                                        res_id = fr.res_id,
                                        res_name = fr.res_name,
                                        res_email_id = fr.res_email_id,
                                        skill_count = fr.skill_count
                                    }).ToList();
            }
                return (filteredResources);
        }
        [HttpPost, Authorize]
        [Route("FilterSkill")]
        public List<SkillSetManager> GetSkillFilterData([FromBody] FilterSkill filter)
        {
            var tempskill = (from ss in _dbContext.skill_set
                             join sg in _dbContext.skill_group on ss.SkillGroupID equals sg.SkillGroupID
                             join s in _dbContext._skill on ss.SkillID equals s.SkillID
                             group new { s, sg } by new { sg.SkillGroup, s.Skill, ss.SkillSetID, sg.SkillGroupID, s.SkillID } into g
                             select new SkillSetManager
                             {
                                 SkillSetID = g.Key.SkillSetID,
                                 SkillGroupID = g.Key.SkillGroupID,
                                 SkillID = g.Key.SkillID,
                                 Skill = g.Key.Skill, // Change this to g.Key.Skill for grouping by skill
                                 SkillGroup = g.Key.SkillGroup,
                                 Description = g.First().s.Description,
                                 status = g.First().s.Status
                             }).ToList();
            var filterdata = (from sk in tempskill.Where(s =>
        (string.IsNullOrEmpty(filter.skill) || filter.skill.ToUpper().Contains(s.Skill.ToUpper())) &&
        (string.IsNullOrEmpty(filter.skillGroup) || filter.skillGroup.ToUpper().Contains(s.SkillGroup.ToUpper())) &&
        (string.IsNullOrEmpty(filter.skillDescription) || (s.Description!=null)&& s.Description.ToUpper().Contains(filter.skillDescription.ToUpper())) &&
        (string.IsNullOrEmpty(filter.skillStatus) || s.status.ToUpper().Contains(filter.skillStatus.ToUpper())))
                      select new SkillSetManager
                      {
                          SkillSetID = sk.SkillSetID,
                          SkillGroupID = sk.SkillGroupID,
                          SkillID = sk.SkillID,
                          SkillGroup = sk.SkillGroup,
                          Skill = sk.Skill,
                          Description = sk.Description,
                          status = sk.status
                      }).ToList();
    return filterdata;
}
    }
}