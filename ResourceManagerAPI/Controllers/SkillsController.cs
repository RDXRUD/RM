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

        [HttpPost, Authorize]
        [Route("SkillByEmail")]
        public List<ResourceSkillManager> GetSkillByEmail(Resources resource)
        {
                var skills = from r in _dbContext.resources
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
                             };

                var employeeskills = skills.Where(s =>
                !String.IsNullOrEmpty(resource.EmailID) && s.EmailID.ToUpper() == resource.EmailID.ToUpper()
                ).ToList();
                return employeeskills;
        }

        [NonAction]
        [HttpGet, Authorize]
        public List<ResourceSkillManager> GetEmployeesSkill()
        {

            var allskill = from r in _dbContext.resources
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
                               EmailID = r.EmailID,
                               SkillGroup = sg.SkillGroup,
                               Skill = m.Skill
                           };
            var employee = allskill.Where(e => _dbContext.employees.Any(s => (s.EmailID == e.EmailID))
            ).ToList();
            return employee;
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

                return Ok();
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
                var existingSkillSet = await _dbContext.skillset.FindAsync(skill.SkillSetID);
                if (existingSkillSet == null)
                {
                    return NotFound();
                }
                existingSkillSet.SkillGroupID = skill.SkillGroupID;

                var existingResourceSkill = await _dbContext.resourceskills.FindAsync(skill.ResourceSkillID);
                if (existingResourceSkill == null)
                {
                    return NotFound();
                }
                existingResourceSkill.SkillSetID = skill.SkillSetID;
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteSkill")]
        public async Task<IActionResult> DeleteSkill([FromBody]ResourceSkillManager skill)
        {
            try
            {
                var skillToDelete = await _dbContext.skill.FirstOrDefaultAsync(s => s.SkillID == skill.SkillID);
                if (skillToDelete == null)
                {
                    return NotFound();
                }
                _dbContext.skill.Remove(skillToDelete);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}