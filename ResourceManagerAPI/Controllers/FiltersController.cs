using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;

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

		[HttpPost, Authorize]
		[Route("FilterEmployees")]
		public List<EmployeeManager> GetFilteredEmployees([FromBody] FilterViewModel filter)
		{
            var tempemployee = from e in _dbContext.employees
                               join et in _dbContext.employeetasks on e.EmpID equals et.EmpID
                               group new { e, et } by new { e.EmpID, e.ResourceName, e.EmailID } into g
                               select new EmployeeManager
                               {
                                   EmpID = g.Key.EmpID,
                                   ResourceName = g.Key.ResourceName,
                                   EmailID = g.Key.EmailID,
                                   TaskName = g.FirstOrDefault().et.TaskName,
                                   Start = g.FirstOrDefault().et.Start,
                                   Finish = g.Max(et => et.et.Finish) 
                               };


            var tempskill = (from r in _dbContext.resources
							 join rs in _dbContext.resourceskills on r.ResourceID equals rs.ResourceID
							 join ss in _dbContext.skillset on rs.SkillSetID equals ss.SkillSetID
							 join s in _dbContext.skill on ss.SkillID equals s.SkillID
							 group s.Skill by new { r.ResourceID, r.EmailID } into g
							 select new ResourceSkillManager
							 {
								 ResourceID = g.Key.ResourceID,
								 EmailID = g.Key.EmailID,
								 Skill = string.Join(", ", g.ToArray())
							 }).ToList();

			if (String.IsNullOrEmpty(filter.Skill))
			{
				var employee = tempemployee.Where(e =>
					((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper().Contains(filter.Name.ToUpper())) || String.IsNullOrEmpty(filter.Name)) &&
					((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper().Contains(filter.EmailID.ToUpper())) || (String.IsNullOrEmpty(filter.EmailID))) &&
					((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper().Contains(filter.TaskName.ToUpper())) || (String.IsNullOrEmpty(filter.TaskName))) &&
					((filter.AssignedFrom.HasValue && filter.AssignedTo.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedTo) || (!filter.AssignedFrom.HasValue || !filter.AssignedTo.HasValue)) &&
					((filter.AssignedFrom.HasValue &&  e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedFrom) || (!filter.AssignedFrom.HasValue)) &&
					((filter.AssignedTo.HasValue && e.Finish >= filter.AssignedTo) || (!filter.AssignedTo.HasValue)) &&
				   ((filter.AvailableFrom.HasValue && e.Finish <= filter.AvailableFrom.Value.Date) || !filter.AvailableFrom.HasValue)
				).AsEnumerable().DistinctBy(e => e.EmpID).ToList();

				return employee;
			}
            else
            {
                string[] filterSkills = filter.Skill.ToUpper().Split(',');

                var employees = tempemployee.ToList().Where(e =>
                    tempskill.Any(s => s.EmailID == e.EmailID) &&
                    filterSkills.All(fs => tempskill.Any(s => s.EmailID == e.EmailID && ContainsSkill(s.Skill.ToUpper().Split(','), fs))) &&
                    ((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper().Contains(filter.Name.ToUpper())) || (String.IsNullOrEmpty(filter.Name))) &&
                    ((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper().Contains(filter.EmailID.ToUpper())) || (String.IsNullOrEmpty(filter.EmailID))) &&
                    ((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper().Contains(filter.TaskName.ToUpper())) || (String.IsNullOrEmpty(filter.TaskName))) &&
                    ((filter.AssignedFrom.HasValue && filter.AssignedTo.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedTo) || (!filter.AssignedFrom.HasValue || !filter.AssignedTo.HasValue)) &&
                    ((filter.AssignedFrom.HasValue && e.Start <= filter.AssignedFrom && e.Finish >= filter.AssignedFrom) || (!filter.AssignedFrom.HasValue)) &&
                    ((filter.AssignedTo.HasValue && e.Finish >= filter.AssignedTo) || (!filter.AssignedTo.HasValue)) &&
                    ((filter.AvailableFrom.HasValue && e.Finish <= filter.AvailableFrom) || (!filter.AvailableFrom.HasValue))
                ).AsEnumerable().DistinctBy(e => e.EmpID).ToList();
                return employees;
            }
        }
        private bool ContainsSkill(string[] skills, string filter)
        {
            return skills.Any(skill => skill.Trim() == filter.Trim());
        }
    }
}


