using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using Microsoft.AspNetCore.Authorization;

namespace ResourceManagerAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly PGDBContext _dbContext;
        
        public SkillsController(PGDBContext context)
        {
            _dbContext = context;
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

        [HttpGet, Authorize]
        [Route("SkillReport")]
        public List<GroupedResourceSkill> GetSkillReport()
        {
            var resSkills = from r in _dbContext.resource_master
                            join rs in _dbContext.resource_skill
                            on r.res_id equals rs.res_id into resSkils
                            from subres in resSkils.DefaultIfEmpty()
                            select new
                            {
                                ResourceID = r.res_id,
                                ResourceName=r.res_name,
                                EmailID = r.res_email_id,
                                ResourceSkillID = (subres == null) ? -1 : subres.ID,
                                SkillSetID = (subres == null) ? -1 : subres.SkillSetID
                            };

            var groupedSkills = (from x in resSkills
                                 join ss in _dbContext.skill_set on x.SkillSetID equals ss.SkillSetID
                                 join sg in _dbContext.skill_group on ss.SkillGroupID equals sg.SkillGroupID
                                 join s in _dbContext._skill on ss.SkillID equals s.SkillID into detail
                                 from m in detail.DefaultIfEmpty()
                                 select new 
                                 {
                                     ResourceID = x.ResourceID,
                                     ResourceName=x.ResourceName,
                                     EmailID = x.EmailID,
                                     SkillID = ss.SkillID,
                                     ResourceSkillID = x.ResourceSkillID,
                                     SkillSetID = x.SkillSetID,
                                     SkillGroupID = sg.SkillGroupID,
                                     SkillGroup = sg.SkillGroup,
                                     Skill = m.Skill
                                 })
                    .GroupBy(rsm => new { rsm.ResourceID, rsm.ResourceName,rsm.EmailID,rsm.SkillGroup })
                    .Select(group => new GroupedResourceSkill
                    {
                        ResourceID = group.Key.ResourceID,
                        ResourceName=group.Key.ResourceName,
                        EmailID=group.Key.EmailID,
                        SkillGroup = group.Key.SkillGroup,
                        Skills = string.Join(", ", group.Select(item => item.Skill))
                    })
                    .OrderBy(item=>item.ResourceID)
                    .ThenBy(item=>item.SkillGroup).ToList();

            return groupedSkills;
        }

            [HttpPost, Authorize]
        [Route("AddSkillToSkillGroup/{id}")]
        public async Task<IActionResult> AddSkillToSkillGroup([FromBody] ResourceSkillManager request,int id)
        {
            try
            {
                var userID = id;
                var modified_date= DateTime.UtcNow;
          
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
                        SkillSetID = result.SkillSetID,
                        last_modified=modified_date,
                        modified_by=userID
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
        [Route("UpdateSetOfSkill/{id}")]
        public async Task<IActionResult> UpdateSkill([FromBody] ResourceSkillManager skill, int id)
        {
            try
            {
                var userID = id;
                var modified_date = DateTime.UtcNow;

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
                existingResourceSkill.modified_by = userID;
                existingResourceSkill.last_modified = modified_date;

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