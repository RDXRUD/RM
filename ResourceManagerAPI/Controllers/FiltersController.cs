using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
using System.Linq;
namespace ResourceManagerAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
    public class FiltersController : Controller
    {
        private readonly PGDBContext _dbContext;
        public FiltersController(PGDBContext empContext)
        {
            _dbContext = empContext;
        }
        //	[HttpPost, Authorize]
        //	[Route("FilterEmployees")]
        //	public List<EmployeeManager> GetFilteredEmployees([FromBody] FilterViewModel filter)
        //	{
        //           var tempemployee = from e in _dbContext.employees
        //                              join et in _dbContext.employeetasks on e.EmpID equals et.EmpID
        //                              group new { e, et } by new { e.EmpID, e.ResourceName, e.EmailID } into g
        //                              select new EmployeeManager
        //                              {
        //                                  EmpID = g.Key.EmpID,
        //                                  ResourceName = g.Key.ResourceName,
        //                                  EmailID = g.Key.EmailID,
        //                                  TaskName = g.FirstOrDefault().et.TaskName,
        //                                  Start = g.FirstOrDefault().et.Start,
        //                                  Finish = g.Max(et => et.et.Finish) 
        //                              };
        //           var tempskill = (from r in _dbContext.resources
        //						 join rs in _dbContext.resourceskills on r.ResourceID equals rs.ResourceID
        //						 join ss in _dbContext.skillset on rs.SkillSetID equals ss.SkillSetID
        //						 join s in _dbContext.skill on ss.SkillID equals s.SkillID
        //						 group s.Skill by new { r.ResourceID, r.EmailID } into g
        //						 select new ResourceSkillManager
        //						 {
        //							 ResourceID = g.Key.ResourceID,
        //							 EmailID = g.Key.EmailID,
        //							 Skill = string.Join(", ", g.ToArray())
        //						 }).ToList();
        //		if (String.IsNullOrEmpty(filter.Skill))
        //		{
        //			var employee = tempemployee.Where(e =>
        //				((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper().Contains(filter.Name.ToUpper())) || String.IsNullOrEmpty(filter.Name)) &&
        //				((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper().Contains(filter.EmailID.ToUpper())) || (String.IsNullOrEmpty(filter.EmailID))) &&
        //				((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper().Contains(filter.TaskName.ToUpper())) || (String.IsNullOrEmpty(filter.TaskName))) &&
        //				((filter.AssignedFrom.HasValue && filter.AssignedTo.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedTo) || (!filter.AssignedFrom.HasValue || !filter.AssignedTo.HasValue)) &&
        //				((filter.AssignedFrom.HasValue &&  e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedFrom) || (!filter.AssignedFrom.HasValue)) &&
        //				((filter.AssignedTo.HasValue && e.Finish >= filter.AssignedTo) || (!filter.AssignedTo.HasValue)) &&
        //			   ((filter.AvailableFrom.HasValue && e.Finish <= filter.AvailableFrom.Value.Date) || !filter.AvailableFrom.HasValue)
        //			).AsEnumerable().DistinctBy(e => e.EmpID).ToList();
        //			return employee;
        //		}
        //           else
        //           {
        //               string[] filterSkills = filter.Skill.ToUpper().Split(',');
        //               var employees = tempemployee.ToList().Where(e =>
        //                   tempskill.Any(s => s.EmailID == e.EmailID) &&
        //                   filterSkills.All(fs => tempskill.Any(s => s.EmailID == e.EmailID && ContainsSkill(s.Skill.ToUpper().Split(','), fs))) &&
        //                   ((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper().Contains(filter.Name.ToUpper())) || (String.IsNullOrEmpty(filter.Name))) &&
        //                   ((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper().Contains(filter.EmailID.ToUpper())) || (String.IsNullOrEmpty(filter.EmailID))) &&
        //                   ((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper().Contains(filter.TaskName.ToUpper())) || (String.IsNullOrEmpty(filter.TaskName))) &&
        //                   ((filter.AssignedFrom.HasValue && filter.AssignedTo.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedTo) || (!filter.AssignedFrom.HasValue || !filter.AssignedTo.HasValue)) &&
        //                   ((filter.AssignedFrom.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedFrom) || (!filter.AssignedFrom.HasValue)) &&
        //                   ((filter.AssignedTo.HasValue && e.Finish >= filter.AssignedTo) || (!filter.AssignedTo.HasValue)) &&
        //                   ((filter.AvailableFrom.HasValue && e.Finish <= filter.AvailableFrom) || (!filter.AvailableFrom.HasValue))
        //               ).AsEnumerable().DistinctBy(e => e.EmpID).ToList();
        //               return employees;
        //           }
        //       }
        //       private bool ContainsSkill(string[] skills, string filter)
        //       {
        //           return skills.Any(skill => skill.Trim() == filter.Trim());
        //       }
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