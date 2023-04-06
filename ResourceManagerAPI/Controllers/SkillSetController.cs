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
            try
            {
                return await _dbContext.skillgroup.ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<SkillGroups>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkillGroup")]
        public async Task<IActionResult> AddSkillGroup(SkillGroups skill)
        {
            try
            {
                SkillGroups skillGroup = new SkillGroups();
                skillGroup.SkillGroupID = skill.SkillGroupID;
                skillGroup.SkillGroup = skill.SkillGroup;
                _dbContext.skillgroup.Add(skillGroup);
                _dbContext.SaveChanges();
                return Ok("Record Added Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillGroup")]
        public async Task<IActionResult> UpdateSkillGroup(SkillGroups skill)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkillGroup")]
        public async Task<IActionResult> DeleteSkillGroup(SkillGroups skill)
        {
            try
            {
                SkillGroups skillGroup = new SkillGroups();
                skillGroup.SkillGroupID = skill.SkillGroupID;
                _dbContext.skillgroup.RemoveRange(skillGroup);
                _dbContext.SaveChanges();
                return Ok("Record Deleted Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("GetSkillSet")]
        public async Task<IActionResult> GetSkillSet()
        {
            try
            {
                var employee = (from sg in _dbContext.skillgroup
                                join ss in _dbContext.skillset
                                on sg.SkillGroupID equals ss.SkillGroupID
                                into detail
                                from m in detail.DefaultIfEmpty()
                                select new SkillSetManager
                                {
                                    ID = m.ID,
                                    SkillGroupID = sg.SkillGroupID,
                                    SkillGroup = sg.SkillGroup,
                                    Skill = m.Skill
                                }
                                ).ToList();
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillSet")]
        public async Task<IActionResult> UpdateSkillSet([FromBody] SkillSetManager skill)
        {
            try
            {
                //var existingSkill = await _dbContext.skillgroup.FindAsync(skill.SkillGroupID);
                //if (existingSkill == null)
                //{
                    //return NotFound();
                //}
                //existingSkill.SkillGroupID = skill.SkillGroupID;
                //existingSkill.SkillGroup = skill.SkillGroup;

                var existingEmployeeSkill = await _dbContext.skillset.FirstOrDefaultAsync(e => e.ID == skill.ID);
                if (existingEmployeeSkill == null)
                {
                    return NotFound();
                }

                existingEmployeeSkill.Skill = skill.Skill;

                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("GetSkill")]
        public async Task<IEnumerable<SkillSet>> GetSkill()
        {
            try
            {
                return await _dbContext.skillset.ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<SkillSet>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkill")]
        public async Task<IActionResult> AddSkill(SkillSet skill)
        {
            try
            {
                SkillSet skillSet = new SkillSet();
                skillSet.SkillGroupID = skill.SkillGroupID;
                skillSet.Skill = skill.Skill;
                _dbContext.skillset.Add(skillSet);
                _dbContext.SaveChanges();
                return Ok("Record Added Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkill")]
        public async Task<IActionResult> UpdateSkill(SkillSet skill)
        {
            try
            {
                var existingSkillSet = await _dbContext.skillset.FindAsync(skill.ID);

                if (existingSkillSet == null)
                {
                    return NotFound();
                }

                existingSkillSet.Skill = skill.Skill;

                _dbContext.Entry(existingSkillSet).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok("Record Updated Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkill")]
        public async Task<IActionResult> DeleteSkillSet(SkillSet skill)
        {
            try
            {
                SkillSet skillSet = new SkillSet();
                skillSet.SkillGroupID = skill.SkillGroupID;
                _dbContext.skillset.RemoveRange(skillSet);
                _dbContext.SaveChanges();
                return Ok("Record Deleted Successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
