using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;

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

        [HttpPost, Authorize]
        [Route("AddSkillSet")]
        public async Task<IActionResult> Put(SkillSet skill)
        {
            SkillSet skillSet = new SkillSet();
            skillSet.ID = skill.ID;
            skillSet.SkillGroup = skill.SkillGroup;
            skillSet.Skill = skill.Skill;
            _dbContext.skillset.Add(skillSet);
            _dbContext.SaveChanges();
            return Ok("Record Added Successfully");
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkillSet")]
        public async Task<IActionResult> Delete(SkillSet skillset)
        {   
            SkillSet skillSet = new SkillSet();
            skillSet.ID = skillset.ID;
            _dbContext.skillset.RemoveRange(skillSet);
            _dbContext.SaveChanges();
            return Ok("Record Deleted Successfully");
        }
    }
}
