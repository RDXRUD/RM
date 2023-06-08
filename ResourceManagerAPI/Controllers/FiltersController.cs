using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : ControllerBase
    {
        private readonly PGDBContext _dbContext;

        public FiltersController(PGDBContext empContext)
        {
            _dbContext = empContext;
        }

        [HttpPost]
        [Authorize]
        [Route("FilterEmployees")]
        public List<EmployeeManager> GetFilteredEmployees([FromBody] FilterViewModel filter)
        {
            var employeesQuery = from e in _dbContext.employees
                                 join et in _dbContext.employeetasks on e.EmpID equals et.EmpID
                                 select new EmployeeManager
                                 {
                                     EmpID = e.EmpID,
                                     ResourceName = e.ResourceName,
                                     EmailID = e.EmailID,
                                     TaskName = et.TaskName,
                                     Start = et.Start,
                                     Finish = et.Finish
                                 };

            var employees = employeesQuery.ToList().Where(e =>
                ((!String.IsNullOrEmpty(filter.Skill) && ContainsAnySkill(e.EmailID, filter.Skill.ToUpper().Split(','))) || String.IsNullOrEmpty(filter.Skill)) &&
                ((!String.IsNullOrEmpty(filter.Name) && e.ResourceName.ToUpper().Contains(filter.Name.ToUpper())) || String.IsNullOrEmpty(filter.Name)) &&
                ((!String.IsNullOrEmpty(filter.EmailID) && e.EmailID.ToUpper().Contains(filter.EmailID.ToUpper())) || String.IsNullOrEmpty(filter.EmailID)) &&
                ((!String.IsNullOrEmpty(filter.TaskName) && e.TaskName.ToUpper().Contains(filter.TaskName.ToUpper())) || String.IsNullOrEmpty(filter.TaskName)) &&
                ((!filter.AssignedFrom.HasValue || e.Start >= filter.AssignedFrom) && (!filter.AssignedTo.HasValue || e.Start <= filter.AssignedTo)) &&
                (filter.AvailableFrom.HasValue ? _dbContext.employeetasks.Any(et => et.EmpID == e.EmpID && et.Start >= filter.AvailableFrom) : true) &&
                (filter.AvailableTo.HasValue ? _dbContext.employeetasks.Any(et => et.EmpID == e.EmpID && et.Finish <= filter.AvailableTo) : true)
            ).ToList();

            return employees;
        }

        private bool ContainsAnySkill(string emailId, string[] filterSkills)
        {
            var skills = _dbContext.resources
                .Join(_dbContext.resourceskills, r => r.ResourceID, rs => rs.ResourceID, (r, rs) => new { r.EmailID, rs.SkillSetID })
                .Join(_dbContext.skillset, rs => rs.SkillSetID, ss => ss.SkillSetID, (rs, ss) => new { rs.EmailID, ss.SkillID })
                .Join(_dbContext.skill, s => s.SkillID, sk => sk.SkillID, (s, sk) => new { s.EmailID, sk.Skill })
                .Where(x => x.EmailID == emailId)
                .Select(x => x.Skill)
                .ToList();

            return filterSkills.Any(fs => skills.Any(s => s.Trim().ToUpper() == fs.Trim().ToUpper()));
        }
    }
}
