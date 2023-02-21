using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;

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


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var skills = (from e in _dbContext.skills
                            join s in _dbContext.employeeskills
                            on e.ID equals s.ID
                            into detail
                            from m in detail.DefaultIfEmpty()

                            select new SkillManager
                            {
                                ID = m.ID,
                                SkillID = m.SkillID,
                                EmailID = m.EmailID,
                                SkillGroup = e.SkillGroup,
                                Skill = e.Skill
                            }

                            ).ToList();


            return Ok(skills);

        }

        [HttpPost]
        public async Task<IActionResult> Put(SkillManager skill)
        {
            var skills = (from e in _dbContext.skills
                          join s in _dbContext.employeeskills
                          on e.ID equals s.ID
                          into detail
                          from m in detail.DefaultIfEmpty()

                          select new SkillManager
                          {
                              ID = m.ID,
                              SkillID = m.SkillID,
                              EmailID = m.EmailID,
                              SkillGroup = e.SkillGroup,
                              Skill = e.Skill
                          }
                            ).ToList();
            _dbContext.Add(skill);
            await _dbContext.SaveChangesAsync();
            return Ok();

        }

        [HttpGet, Route("GetSkill")]
        public List<SkillManager> GetEmployeesSkill()
        {

            var allskill = from s in _dbContext.skills
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

            var employee = allskill.Where(e => _dbContext.employees.Any(s => (s.EmailID == e.EmailID)) 
            ).ToList();

            return employee;
        }

    }
}