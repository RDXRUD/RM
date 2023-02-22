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
    ((filter.Skill != "" && s.Skill == filter.Skill) || (filter.Skill == "")) &&
    ((filter.EmpID != 0 && e.EmpID == filter.EmpID) || (filter.EmpID == 0))) &&
    ((filter.Name != "" && e.ResourceName == filter.Name) || (filter.Name == "")) &&
    ((filter.EmailAddress != "" && e.EmailID == filter.EmailAddress) || (filter.EmailAddress == "")) &&
    ((filter.TaskName != "" && e.TaskName == filter.TaskName) || (filter.TaskName == "")) &&
    ((filter.AssignedFrom !=null && e.Start>=filter.AssignedFrom && e.Start <= filter.AssignedTo) || (filter.AssignedFrom == null && filter.AssignedTo == null)) &&
    ((filter.AvailableFrom != null && e.Finish >= filter.AvailableFrom && e.Finish <= filter.AvailableTo) || (filter.AvailableFrom == null && filter.AvailableTo == null))
    ).ToList();

            return employee;
        }

    }
}


