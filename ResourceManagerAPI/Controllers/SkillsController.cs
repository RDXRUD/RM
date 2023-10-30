using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using Microsoft.AspNetCore.Authorization;

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

        [HttpGet, Authorize]
        [Route("GetSetOfSkill")]
        public async Task<IActionResult> GetSkill()
        {
            try
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
                                  ResourceSkillID=rs.ResourceSkillID,
                                  SkillSetID=rs.SkillSetID,
                                  SkillGroupID=sg.SkillGroupID,
                                  EmailID = r.EmailID,
                                  SkillGroup = sg.SkillGroup,
                                  Skill = m.Skill
                              }
                                ).ToList();
                return Ok(skills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("SkillByEmail/{email}")]
        public List<ResourceSkillManager> GetSkillByEmail(string email)
        {
                var resSkills = from r in _dbContext.resource_master
                             join rs in _dbContext.resource_skill
                             on r.res_id equals rs.res_id into resSkils
                             from subres in resSkils.DefaultIfEmpty()
                             select new 
                             {
                                ResourceID = r.res_id,
                                EmailID = r.res_email_id,
                                ResourceSkillID = (subres == null) ? - 1 : subres.ID,
                                SkillSetID = (subres == null) ? - 1 : subres.SkillSetID
                             };
                var skills = from x in resSkills
                             join ss in _dbContext.skill_set
                             on x.SkillSetID equals ss.SkillSetID
                             join sg in _dbContext.skill_group
                             on ss.SkillGroupID equals sg.SkillGroupID
                             join s in _dbContext._skill
                             on ss.SkillID equals s.SkillID
                             into detail
                             from m in detail.DefaultIfEmpty()
                             select new ResourceSkillManager
                             {
                                 ResourceID = x.ResourceID,
                                 SkillID = ss.SkillID,
                                 ResourceSkillID = x.ResourceSkillID,
                                 SkillSetID = x.SkillSetID,
                                 SkillGroupID = sg.SkillGroupID,
                                 EmailID = x.EmailID,
                                 SkillGroup = sg.SkillGroup,
                                 Skill = m.Skill
                             };

                var resourceskills = skills.Where(s =>
                !String.IsNullOrEmpty(email) && s.EmailID.ToUpper() == email.ToUpper()
                ).ToList();
                return resourceskills;
        }

        [HttpPost, Authorize]
        [Route("AddNewSetOfSkill")]
        public async Task<IActionResult> AddNewSkill(ResourceSkillManager skill)
        {
            try
            {
                var skillgroup = new SkillGroups
                {
                    SkillGroup = skill.SkillGroup,
                };
                _dbContext.skillgroup.Add(skillgroup);
                await _dbContext.SaveChangesAsync();

                var resources = new Resources
                {
                    ResourceID = skill.ResourceID,
                    EmailID= skill.EmailID
                   
                };
                _dbContext.resources.Add(resources);
                await _dbContext.SaveChangesAsync();

                var skills = new Skills
                {
                    Skill = skill.Skill
                };
                _dbContext.skill.Add(skills);
                await _dbContext.SaveChangesAsync();

                return Ok("{\"message\": \"Record Added Successfully\"}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkillToSkillGroup")]
        public async Task<IActionResult> AddSkillToSkillGroup([FromBody] ResourceSkillManager request)
        {
            try
            {
                var resource = await _dbContext.resource_master.FirstOrDefaultAsync(r => r.res_email_id == request.EmailID);

                if (resource == null)
                {
                    return NotFound($"Resource with EmailID {request.EmailID} not found.");
                }

                var skill = await _dbContext._skill.FirstOrDefaultAsync(s => s.SkillID == request.SkillID);

                if (skill == null)
                {
                    return NotFound($"Skill with ID {request.SkillID} not found.");
                }

                var skillGroup = await _dbContext.skill_group.FirstOrDefaultAsync(sg => sg.SkillGroupID == request.SkillGroupID);

                if (skillGroup == null)
                {
                    return NotFound($"Skill group with ID {request.SkillGroupID} not found.");
                }

                if (skill != null && skillGroup != null)
                {
                    var result = await _dbContext.skill_set.FirstOrDefaultAsync(x => x.SkillID == request.SkillID && x.SkillGroupID == request.SkillGroupID);
                    var existing = await _dbContext.resource_skill.FirstOrDefaultAsync(rs =>
                                    rs.res_id == resource.res_id && rs.SkillSetID == result.SkillSetID);

                    if (existing != null)
                    {
                        return BadRequest("Resource already has the requested skill group and skill.");
                    }
                    var resourceSkill = new NewResourceSkills
                    {
                        res_id = resource.res_id,
                        SkillSetID = result.SkillSetID
                    };

                    _dbContext.resource_skill.Add(resourceSkill);
                    await _dbContext.SaveChangesAsync();
                }
                    return Ok("{\"message\": \"Record Added Successfully\"}");
            }

            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

		[HttpPut, Authorize]
        [Route("UpdateSetOfSkill")]
        public async Task<IActionResult> UpdateSkill([FromBody] ResourceSkillManager skill)
        {
            try
            {
                var existingSkillSet = await _dbContext.skill_set.FindAsync(skill.SkillSetID);
                if (existingSkillSet == null)
                {
                    return NotFound();
                }
                existingSkillSet.SkillGroupID = skill.SkillGroupID;
                var existing = (from rs in _dbContext.resource_skill.Where(r => r.res_id == skill.ResourceID)
                                join ss in _dbContext.skill_set
                                on rs.SkillSetID equals ss.SkillSetID
                                into detail
                                from m in detail.DefaultIfEmpty()
                                select new SkillSetManager
                                {
                                    SkillGroupID = m.SkillGroupID,
                                    SkillID = m.SkillID,
                                }

                                ).ToList().FirstOrDefault(x => x.SkillGroupID == existingSkillSet.SkillGroupID && x.SkillID == existingSkillSet.SkillID);
                if (existing != null)
                {
                    return StatusCode(502, "Record is already present");
  
                }
                _dbContext.Entry(existingSkillSet).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                var existingResourceSkill = await _dbContext.resource_skill.FindAsync(skill.ResourceSkillID);
                if (existingResourceSkill == null)
                {
                    return NotFound();
                }
                existingResourceSkill.SkillSetID = skill.SkillSetID;
                _dbContext.Entry(existingResourceSkill).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok("{\"message\": \"Record Updated Successfully\"}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteResourceSkill/{id}")]
        public async Task<IActionResult> DeleteResourceSkill(int id)
        {
            try
            {
                var existing = await _dbContext.resource_skill.FindAsync(id);
                if (existing == null)
                {
                    return NotFound();
                }
                _dbContext.resource_skill.Remove(existing);
                await _dbContext.SaveChangesAsync();

                return Ok("{\"message\": \"Record Deleted Successfully\"}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}