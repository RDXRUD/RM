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

            var employee = tempemployee.Where(e => tempskill.Any(s => (s.EmailID == e.EmailID)  &&
    ((filter.Skill != null && s.Skill.ToUpper() == filter.Skill.ToUpper()) || (filter.Skill == null || filter.Skill == ""))) &&
    ((filter.Name != null && e.ResourceName.ToUpper() == filter.Name.ToUpper()) || (filter.Name == null || filter.Name == "")) &&
    ((filter.EmailID != null && e.EmailID.ToUpper() == filter.EmailID.ToUpper()) || (filter.EmailID == null || filter.EmailID == "")) &&
    ((filter.TaskName != null && e.TaskName.ToUpper() == filter.TaskName.ToUpper()) || (filter.TaskName == null || filter.TaskName == "")) &&
    ((filter.AssignedFrom !=null && e.Start>=filter.AssignedFrom && e.Start <= filter.AssignedTo) || (filter.AssignedFrom == null && filter.AssignedTo == null)) &&
    ((filter.AvailableFrom != null && e.Finish >= filter.AvailableFrom && e.Finish <= filter.AvailableTo) || (filter.AvailableFrom == null && filter.AvailableTo == null))
    ).ToList();

            return employee;
        }

    }
}


