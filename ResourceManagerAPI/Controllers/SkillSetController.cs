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
                var employee = (from ss in _dbContext.skillset
                                join s in _dbContext.skill
                                on ss.SkillID equals s.SkillID
                                join sg in _dbContext.skillgroup
                                on ss.SkillGroupID equals sg.SkillGroupID
                                into detail
                                from m in detail.DefaultIfEmpty()
                                select new SkillSetManager
                                {
                                    SkillSetID = ss.SkillSetID,
                                    SkillGroupID = ss.SkillGroupID,
                                    SkillID = s.SkillID,
                                    SkillGroup = m.SkillGroup,
                                    Skill = s.Skill
                                }
                                ).ToList();
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkillSet")]
        public async Task<IActionResult> AddSkillSet([FromBody] SkillSetManager skill)
        {
            Skills skillForAdd = new Skills();
            skillForAdd.SkillID = skill.SkillID;
            skillForAdd.Skill = skill.Skill;
            _dbContext.skill.Add(skillForAdd);
            _dbContext.SaveChanges();

            SkillSet skillSetForAdd = new SkillSet();
            skillSetForAdd.SkillSetID = skill.SkillID;
            skillSetForAdd.SkillGroupID = skill.SkillGroupID;
            skillSetForAdd.SkillID = skill.SkillID;
            _dbContext.skillset.Add(skillSetForAdd);
            _dbContext.SaveChanges();
            return Ok("Record Added Successfully");
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillSet")]
        public async Task<IActionResult> UpdateSkillSet([FromBody] SkillSetManager skill)
        {
            try
            {
                var existingSkillSet = await _dbContext.skillset.FindAsync(skill.SkillSetID);
                if (existingSkillSet == null)
                {
                    return NotFound();
                }
                existingSkillSet.SkillID = skill.SkillID;
                existingSkillSet.SkillGroupID = skill.SkillGroupID;

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
        [Route("DeleteSkillSet")]
        public async Task<IActionResult> DeleteSkillSet(SkillSet skill)
        {
            var skillToDelete = await _dbContext.skillset.FindAsync(skill.SkillSetID);
            _dbContext.skillset.RemoveRange(skillToDelete);
            _dbContext.SaveChanges();
            return Ok("Record Deleted Successfully");
        }

        [HttpGet, Authorize]
        [Route("GetSkill")]
        public async Task<IEnumerable<Skills>> GetSkill()
        {
            try
            {
                return await _dbContext.skill.ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<Skills>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkill")]
        public async Task<IActionResult> AddSkill(Skills skill)
        {
            try
            {
                Skills skillForAdd = new Skills();
                skillForAdd.Skill = skill.Skill;
                _dbContext.skill.Add(skillForAdd);
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
        public async Task<IActionResult> UpdateSkill(Skills skill)
        {
            try
            {
                var existingSkill = await _dbContext.skill.FindAsync(skill.SkillID);

                if (existingSkill == null)
                {
                    return NotFound();
                }

                existingSkill.Skill = skill.Skill;

                _dbContext.Entry(existingSkill).State = EntityState.Modified;
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
        public async Task<IActionResult> DeleteSkill(Skills skill)
        {
            try
            {
                SkillSet skillSet = new SkillSet();
                skillSet.SkillID = skill.SkillID;
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
