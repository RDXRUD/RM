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
        [Route("GetSkillGroup")]
        public async Task<IEnumerable<SkillGroups>> GetSkillGroup()
        {
            return await _dbContext.skillgroup.ToListAsync();
        }

        [HttpPost, Authorize]
        [Route("AddSkillGroup")]
        public async Task<IActionResult> Put(SkillGroups skill)
        {
            SkillGroups skillGroup = new SkillGroups();
            skillGroup.SkillGroupID = skill.SkillGroupID;
            skillGroup.SkillGroup = skill.SkillGroup;
            _dbContext.skillgroup.Add(skillGroup);
            _dbContext.SaveChanges();
            return Ok("Record Added Successfully");
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillGroup")]
        public async Task<IActionResult> Update(SkillGroups skill)
        {
            var existingSkillGroup = await _dbContext.skillgroup.FindAsync(skill.SkillGroupID);

            if (existingSkillGroup == null)
            {
                return NotFound();
            }

            existingSkillGroup.SkillGroup = skill.SkillGroup;

            _dbContext.Entry(existingSkillGroup).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return Ok("Record Updated Successfully");
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkillGroup")]
        public async Task<IActionResult> DeleteSkillGroup(SkillGroups skill)
        {
            SkillGroups skillGroup = new SkillGroups();
            skillGroup.SkillGroupID = skill.SkillGroupID;
            _dbContext.skillgroup.RemoveRange(skillGroup);
            _dbContext.SaveChanges();
            return Ok("Record Deleted Successfully");
        }

        [HttpGet, Authorize]
        [Route("GetSkillSet")]
        public async Task<IActionResult> GetSkillSet()
        {
            var employee = (from sg in _dbContext.skillgroup
                            join ss in _dbContext.skillset
                            on sg.SkillGroupID equals ss.SkillGroupID
                            into detail
                            from m in detail.DefaultIfEmpty()
                            select new SkillSetManager
                            {
                                SkillGroupID = sg.SkillGroupID,
                                SkillGroup = sg.SkillGroup,
                                Skill = m.Skill
                            }
                            ).ToList();
            return Ok(employee);
        }

        [HttpPost, Authorize]
        [Route("AddSkill")]
        public async Task<IActionResult> Put(SkillSet skill)
        {
            SkillSet skillSet = new SkillSet();
            skillSet.SkillGroupID = skill.SkillGroupID;
            skillSet.Skill = skill.Skill;
            _dbContext.skillset.Add(skillSet);
            _dbContext.SaveChanges();
            return Ok("Record Added Successfully");
        }

        [HttpPut, Authorize]
        [Route("UpdateSkill")]
        public async Task<IActionResult> Update(SkillSet skill)
        {
            var existingSkillSet = await _dbContext.skillset.FindAsync(skill.SkillGroupID);

            if (existingSkillSet == null)
            {
                return NotFound();
            }

            existingSkillSet.Skill = skill.Skill;

            _dbContext.Entry(existingSkillSet).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return Ok("Record Updated Successfully");
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkill")]
        public async Task<IActionResult> DeleteSkillSet(SkillSet skill)
        {
            SkillSet skillSet = new SkillSet();
            skillSet.SkillGroupID = skill.SkillGroupID;
            _dbContext.skillset.RemoveRange(skillSet);
            _dbContext.SaveChanges();
            return Ok("Record Deleted Successfully");
        }
    }
}
