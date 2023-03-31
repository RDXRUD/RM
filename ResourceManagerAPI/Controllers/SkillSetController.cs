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

        //[HttpPost, Authorize]
        //[Route("AddSkillSet")]
        //public async Task<IActionResult> Put(SkillSet skill)
        //{
        //    SkillSet skillSet = new SkillSet();
        //    skillSet.ID = skill.ID;
        //    skillSet.SkillGroup = skill.SkillGroup;
        //    skillSet.Skill = skill.Skill;
        //    _dbContext.skillset.Add(skillSet);
        //    _dbContext.SaveChanges();
        //    return Ok("Record Added Successfully");
        //}

        //[HttpPut, Authorize]
        //[Route("UpdateSkillSet")]
        //public async Task<IActionResult> Update(SkillSet skill)
        //{
        //    var existingSkillSet = await _dbContext.skillset.FindAsync(skill.ID);

        //    if (existingSkillSet == null)
        //    {
        //        return NotFound();
        //    }

        //    existingSkillSet.SkillGroup = skill.SkillGroup;
        //    existingSkillSet.Skill = skill.Skill;

        //    _dbContext.Entry(existingSkillSet).State = EntityState.Modified;
        //    await _dbContext.SaveChangesAsync();

        //    return Ok("Record Updated Successfully");
        //}

        [HttpDelete, Authorize]
        [Route("DeleteSkillSet")]
        public async Task<IActionResult> Delete(SkillSet skill)
        {
            SkillSet skillSet = new SkillSet();
            skillSet.ID = skill.ID;
            _dbContext.skillset.RemoveRange(skillSet);
            _dbContext.SaveChanges();
            return Ok("Record Deleted Successfully");
        }
    }
}
