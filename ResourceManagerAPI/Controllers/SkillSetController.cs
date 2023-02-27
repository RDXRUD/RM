using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
namespace ResourceManagerAPI.Controllers
{
     [Route("api/[controller]")]
        [ApiController]
        public class SkillSetController : Controller
        {
            private readonly PGDBContext _dbContext;

            public SkillSetController(PGDBContext context)
            {
                _dbContext = context;
            }

        [HttpGet]
        public async Task<IEnumerable<SkillSet>> Get()
        {
            return await _dbContext.skillset.ToListAsync();
        }

        [HttpPut]
        public async Task<IActionResult> Put(SkillSet skill)
        {
            if (skill == null || skill.ID == 0)
                return BadRequest();

            var skillset = await _dbContext.skillset.FindAsync(skill.ID);
            if (skillset == null)
                return NotFound();
            skillset.ID = skill.ID;
            skillset.SkillGroup = skill.SkillGroup;
            skillset.Skill = skill.Skill;
            
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id < 1)
                return BadRequest();
            var skill = await _dbContext.skillset.FindAsync(id);
            if (skill == null)
                return NotFound();
            _dbContext.skillset.Remove(skill);
            await _dbContext.SaveChangesAsync();
            return Ok();

        }
    }
}
