using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly SkillDBContext _context;

        public SkillsController(SkillDBContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Skill skill)
        {
            _context.Add(skill);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPut]
        public async Task<IActionResult> Put(Skill skillData)
        {
            if (skillData == null || skillData.ID == 0)
                return BadRequest();

            var skill = await _context.skill.FindAsync(skillData.ID);
            if (skill == null)
                return NotFound();
            skill.resource_name = skillData.resource_name;
            skill.email_id = skillData.email_id;
            skill.skill_group = skillData.skill_group;
            skill.skill = skillData.skill;
            skill.master_resource_uid = skillData.master_resource_uid;
            skill.skill_set_uid = skillData.skill_set_uid;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id < 1)
                return BadRequest();
            var skill = await _context.skill.FindAsync(id);
            if (skill == null)
                return NotFound();
            _context.skill.Remove(skill);
            await _context.SaveChangesAsync();
            return Ok();

        }


    }
}