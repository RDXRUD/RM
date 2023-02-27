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
            var skills = (from e in _dbContext.employeeskills
                            join s in _dbContext.skills
                            on e.ResourceID equals s.ResourceID
                            into detail
                            from m in detail.DefaultIfEmpty()
                            select new SkillManager
                            {
                                ID = m.ID,
                                ResourceID = e.ResourceID,
                                SkillID = m.SkillID,
                                EmailID = e.EmailID,
                                SkillGroup = m.SkillGroup,
                                Skill = m.Skill
                            }
                            ).ToList();
            return Ok(skills);
        }

        [HttpPost]
        public List<SkillManager> Post(SkillManager skill)
        {
            var skills = (from e in _dbContext.employeeskills
                          join s in _dbContext.skills
                          on e.ResourceID equals s.ResourceID
                          into detail
                          from m in detail.DefaultIfEmpty()
                          select new SkillManager
                          {
                              ID = m.ID,
                              ResourceID = e.ResourceID,
                              SkillID = m.SkillID,
                              EmailID = e.EmailID,
                              SkillGroup = m.SkillGroup,
                              Skill = m.Skill
                          }
                            ).ToList();
            return skills;
        }

        [HttpGet, Route("GetSkillDetails")]
        public List<SkillManager> GetEmployeesSkill()
        {

            var allskill = from es in _dbContext.employeeskills
                            join s in _dbContext.skills
                         on es.ResourceID equals s.ResourceID
                            select new SkillManager
                            {
                                ID = s.ID,
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

        [HttpPut]
        public async Task<IActionResult> Put(SkillManager skill)
        {
            var skills = (from e in _dbContext.employeeskills
                          join s in _dbContext.skills
                          on e.ResourceID equals s.ResourceID
                          into detail
                          from m in detail.DefaultIfEmpty()
                          select new SkillManager
                          {
                              ID = m.ID,
                              ResourceID = e.ResourceID,
                              SkillID = m.SkillID,
                              EmailID = e.EmailID,
                              SkillGroup = m.SkillGroup,
                              Skill = m.Skill
                          }
                            ).ToList();
            _dbContext.Add(skill);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}