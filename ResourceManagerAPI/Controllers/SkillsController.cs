using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using jdk.nashorn.tools;


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

        //[HttpPost]
        //public async Task<IActionResult> Post(Skills skill)
        //{
        //    _dbContext.Add(skill);
        //    await _dbContext.SaveChangesAsync();
        //    return Ok();
        //}
        //[HttpPut]
        //public async Task<IActionResult> Put(Skills skillData)
        //{
        //    if (skillData == null || skillData.EmpID == 0)
        //        return BadRequest();

        //    var skill = await _dbContext.Skills.FindAsync(skillData.ID);
        //    if (skill == null)
        //        return NotFound();
        //    skill.ResourceName = skillData.ResourceName;
        //    skill.EmailID = skillData.EmailID;
        //    skill.SkillGroup = skillData.SkillGroup;
        //    skill.Skill = skillData.Skill;
        //    skill.MasterResourceUID = skillData.MasterResourceUID;
        //    skill.SkillSetUID = skillData.SkillSetUID;
        //    await _dbContext.SaveChangesAsync();
        //    return Ok();
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    if (id < 1)
        //        return BadRequest();
        //    var skill = await _context.skills.FindAsync(id);
        //    if (skill == null)
        //        return NotFound();
        //    _context.skills.Remove(skill);
        //    await _context.SaveChangesAsync();
        //    return Ok();

        //}


    }
}