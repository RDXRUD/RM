using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using Microsoft.AspNetCore.Authorization;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly PGDBContext _dbContext;

        public SkillsController(PGDBContext context)
        {
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("GetSkill")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var skills = (from e in _dbContext.employeeskills
                              join s in _dbContext.skills
                              on e.ResourceID equals s.ResourceID
                              into detail
                              from m in detail.DefaultIfEmpty()
                              select new SkillManager
                              {
                                  ResourceID = e.ResourceID,
                                  SkillID = m.SkillID,
                                  EmailID = e.EmailID,
                                  SkillGroup = m.SkillGroup,
                                  Skill = m.Skill
                              }
                                ).ToList();
                return Ok(skills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("SkillByEmail")]
        public List<SkillManager> GetSkillByEmail(EmployeeSkills skill)
        {
                var skills = from e in _dbContext.employeeskills
                             join s in _dbContext.skills
                             on e.ResourceID equals s.ResourceID
                             into detail
                             from m in detail.DefaultIfEmpty()
                             select new SkillManager
                             {
                                 ResourceID = e.ResourceID,
                                 SkillID = m.SkillID,
                                 EmailID = e.EmailID,
                                 SkillGroup = m.SkillGroup,
                                 Skill = m.Skill
                             };

                var employeeskills = skills.Where(s =>
                !String.IsNullOrEmpty(skill.EmailID) && s.EmailID.ToUpper() == skill.EmailID.ToUpper()
                ).ToList();
                return employeeskills;

        }

        [NonAction]
        [HttpGet, Authorize]
        public List<SkillManager> GetEmployeesSkill()
        {

            var allskill = from es in _dbContext.employeeskills
                           join s in _dbContext.skills
                        on es.ResourceID equals s.ResourceID
                           select new SkillManager
                           {
                               ResourceID = es.ResourceID,
                               SkillID = s.SkillID,
                               EmailID = es.EmailID,
                               SkillGroup = s.SkillGroup,
                               Skill = s.Skill
                           };
            var employee = allskill.Where(e => _dbContext.employees.Any(s => (s.EmailID == e.EmailID))
            ).ToList();
            return employee;
        }

        [HttpPost, Authorize]
        [Route("AddNewSkill")]
        public async Task<IActionResult> AddNewSkill(SkillManager skill)
        {
            try
            {
                var newSkill = new Skills
                {
                    Skill = skill.Skill,
                    SkillGroup = skill.SkillGroup,
                    SkillID = skill.SkillID
                };
                _dbContext.skills.Add(newSkill);
                await _dbContext.SaveChangesAsync();

                var employeeSkill = new EmployeeSkills
                {
                    ResourceID = skill.ResourceID,
                    EmailID= skill.EmailID
                   
                };
                _dbContext.employeeskills.Add(employeeSkill);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkill")]
        public async Task<IActionResult> UpdateSkill([FromBody] SkillManager skill)
        {
            try
            {
                var existingSkill = await _dbContext.skills.FindAsync(skill.ResourceID);
                if (existingSkill == null)
                {
                    return NotFound();
                }
                existingSkill.ResourceID = skill.ResourceID;
                existingSkill.Skill = skill.Skill;
                existingSkill.SkillGroup = skill.SkillGroup;
                existingSkill.SkillID = skill.SkillID;

                var existingEmployeeSkill = await _dbContext.employeeskills.FirstOrDefaultAsync(e => e.ResourceID == skill.ResourceID);
                if (existingEmployeeSkill == null)
                {
                    return NotFound();
                }

                existingEmployeeSkill.EmailID = skill.EmailID;

                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkill")]
        public async Task<IActionResult> DeleteSkill([FromBody]SkillManager skill)
        {
            try
            {
                var skillToDelete = await _dbContext.skills.FirstOrDefaultAsync(s => s.ResourceID == skill.ResourceID);
                if (skillToDelete == null)
                {
                    return NotFound();
                }
                _dbContext.skills.Remove(skillToDelete);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}