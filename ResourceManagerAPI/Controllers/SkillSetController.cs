using Microsoft.AspNetCore.Authorization;
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

        [HttpGet, Authorize]
        [Route("GetSkillSet")]
        public async Task<IEnumerable<SkillSet>> Get()
        {
            return await _dbContext.skillset.ToListAsync();
        }

        [HttpPut, Authorize]
        [Route("AddSkillSet")]
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

        [HttpDelete, Authorize]
        [Route("DeleteSkillSet")]
        public async Task<IActionResult> Delete(SkillSet skillset)
        {
            if (skillset.ID < 1)
                return BadRequest();
            var skill = await _dbContext.skillset.FindAsync(skillset.ID);
            if (skill == null)
                return NotFound();
            _dbContext.skillset.Remove(skill);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
