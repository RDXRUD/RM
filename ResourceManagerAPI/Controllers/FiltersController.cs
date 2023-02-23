using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;

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

        [HttpPost, Route("GetFilteredEmployees")]
        public List<EmployeeManager> GetFilteredEmployees(FilterViewModel filter)
        {
            var tempemployee = from e in _dbContext.employees
                               join et in _dbContext.employeetasks
                           on e.EmpID equals et.EmpID
                               select new EmployeeManager
                               {
                                   EmpID = e.EmpID,
                                   ResourceName = e.ResourceName,
                                   EmailID = e.EmailID,
                                   TaskName = et.TaskName,
                                   Start = et.Start,
                                   Finish = et.Finish
                               };

            var tempskill = from s in _dbContext.skills
                            join es in _dbContext.employeeskills
                         on s.ID equals es.ID
                            select new SkillManager
                            {
                                ID = s.ID,
                                SkillID = s.SkillID,
                                EmailID = es.EmailID,
                                SkillGroup = s.SkillGroup,
                                Skill = s.Skill
                            };

            if (String.IsNullOrEmpty(filter.Skill))
            {
                var employee = tempemployee.Where(e =>
        ((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper() == filter.Name.ToUpper()) || String.IsNullOrEmpty(filter.Name)) &&
        ((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper() == filter.EmailID.ToUpper()) || (String.IsNullOrEmpty(filter.EmailID))) &&
        ((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper() == filter.TaskName.ToUpper()) || (String.IsNullOrEmpty(filter.TaskName))) &&
        ((filter.AssignedFrom.HasValue && e.Start >= filter.AssignedFrom && e.Start <= filter.AssignedTo) || (!filter.AssignedFrom.HasValue && !filter.AssignedTo.HasValue)) &&
        ((filter.AvailableFrom.HasValue && e.Finish >= filter.AvailableFrom && e.Finish <= filter.AvailableTo) || (!filter.AvailableFrom.HasValue && !filter.AvailableTo.HasValue))
        ).ToList();
                return employee;
            }
            else
            {
                var employees = tempemployee.Where(e => tempskill.Any(s => (s.EmailID == e.EmailID) &&
              ((!String.IsNullOrEmpty(filter.Skill) && s.Skill.ToUpper() == filter.Skill.ToUpper()) || (String.IsNullOrEmpty(filter.Skill)))) &&
              ((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper() == filter.Name.ToUpper()) || (String.IsNullOrEmpty(filter.Name))) &&
              ((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper() == filter.EmailID.ToUpper()) || (String.IsNullOrEmpty(filter.EmailID))) &&
              ((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper() == filter.TaskName.ToUpper()) || (String.IsNullOrEmpty(filter.TaskName))) &&
              ((filter.AssignedFrom.HasValue && e.Start >= filter.AssignedFrom && e.Start <= filter.AssignedTo) || (!filter.AssignedFrom.HasValue && !filter.AssignedTo.HasValue)) &&
              ((filter.AvailableFrom.HasValue && e.Finish >= filter.AvailableFrom && e.Finish <= filter.AvailableTo) || (!filter.AvailableFrom.HasValue && !filter.AvailableTo.HasValue))
              ).ToList();
                return employees;
            }
        }
    }
}


