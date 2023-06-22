using jdk.nashorn.tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Models;
using System.Linq;
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
				int? intSkillGroupId = _dbContext.skillgroup.Max(r => (int?)r.SkillGroupID);
				int skillGroupID = (intSkillGroupId is null) ? 1 : (int)intSkillGroupId;
                skillGroup.SkillGroupID = skillGroupID + 1;
                skillGroup.SkillGroup = skill.SkillGroup;
                _dbContext.skillgroup.Add(skillGroup);
                _dbContext.SaveChanges();
                return Ok("{\"message\": \"Record Added Successfully\"}");
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
                return Ok("{\"message\": \"Record Updated Successfully\"}");
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
                return Ok("{\"message\": \"Record Deleted Successfully\"}");
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
        public IActionResult AddSkillSet([FromBody] SkillSetManager skill)
        {
            Skills skillForAdd = new Skills();
			int? intSkillId = _dbContext.skill.Max(r => (int?)r.SkillID);
			int skillID = (intSkillId is null) ? 1 : (int)intSkillId;
            skillForAdd.SkillID = skillID + 1;
            skillForAdd.Skill = skill.Skill;
            _dbContext.skill.Add(skillForAdd);
            _dbContext.SaveChanges();

            SkillSet skillSetForAdd = new SkillSet();
			int? intSkillsetId = _dbContext.skillset.Max(r => (int?)r.SkillID);
			int skillsetID = (intSkillsetId is null) ? 1 : (int)intSkillsetId;
			skillSetForAdd.SkillGroupID = skill.SkillGroupID;
            skillSetForAdd.SkillSetID = skillsetID + 1;
            skillSetForAdd.SkillID = skillsetID + 1;
            _dbContext.skillset.Add(skillSetForAdd);
            _dbContext.SaveChanges();
            return Ok("{\"message\": \"Record Added Successfully\"}");
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

                return Ok("{\"message\": \"Record Updated Successfully\"}");
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
            var skills = (from r in _dbContext.resources
                          join rs in _dbContext.resourceskills
                          on r.ResourceID equals rs.ResourceID
                          join ss in _dbContext.skillset
                          on rs.SkillSetID equals ss.SkillSetID
                          join sg in _dbContext.skillgroup
                          on ss.SkillGroupID equals sg.SkillGroupID
                          join s in _dbContext.skill
                          on ss.SkillID equals s.SkillID
                          into detail
                          from m in detail.DefaultIfEmpty()
                          select new ResourceSkillManager
                          {
                              ResourceID = r.ResourceID,
                              SkillID = ss.SkillID,
                              ResourceSkillID = rs.ResourceSkillID,
                              SkillSetID = rs.SkillSetID,
                              SkillGroupID = sg.SkillGroupID,
                              EmailID = r.EmailID,
                              SkillGroup = sg.SkillGroup,
                              Skill = m.Skill
                          }
                                ).ToList();

            if (!skills.Any(s => s.SkillSetID == skill.SkillSetID))
            {
                var skillSetToDelete = await _dbContext.skillset.FindAsync(skill.SkillSetID);
				_dbContext.skillset.RemoveRange(skillSetToDelete);
				_dbContext.SaveChanges();
				Skills skillSet = new Skills();
				skillSet.SkillID = skill.SkillSetID;
				_dbContext.skill.RemoveRange(skillSet);
				_dbContext.SaveChanges();
				return Ok("{\"message\": \"Record Deleted Successfully\"}");
            }
            else
            {
                return BadRequest("{\"message\":\"This field is used in another process, you can't delete it\"}");
            }
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
		[Route("GetSkillAsPerSkillGroup")]
		public async Task<IEnumerable<Skills>> GetSkill([FromBody]SkillGroups skillGroup)
		{
			try
			{
				var employee = await(from ss in _dbContext.skillset
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
								).ToListAsync();

				var skill = employee.Where(e => e.SkillGroupID == skillGroup.SkillGroupID).Select(e => new Skills {SkillID=e.SkillID, Skill = e.Skill }).ToList();

				if (skill != null)
				{
					return skill;
				}
				else
				{
					return Enumerable.Empty<Skills>();
				}
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
                return Ok("{\"message\": \"Record Added Successfully\"}");
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
                return Ok("{\"message\": \"Record Updated Successfully\"}");
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
                return Ok("{\"message\": \"Record Deleted Successfully\"}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
