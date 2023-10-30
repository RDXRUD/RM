using com.sun.org.glassfish.gmbal;
using jdk.nashorn.tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using net.sf.mpxj.primavera.schema;
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
        [Route("GetSkillGroupActive")]
        public async Task<IEnumerable<NewSkillGroup>> GetSkillGroup()
        {
            try
            {
                return await _dbContext.skill_group.Where(s=>s.Status=="ACTIVE").ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<NewSkillGroup>)StatusCode(500, ex.Message);
            }
        }
        [HttpGet, Authorize]
        [Route("GetSkillGroupAll")]
        public async Task<IEnumerable<NewSkillGroup>> GetSkillGroups()
        {
            try
            {
                return await _dbContext.skill_group.ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<NewSkillGroup>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkillGroup")]
        public IActionResult AddSkillGroup(NewSkillGroup newSkillGroup)
        {
            if (newSkillGroup.SkillGroup == null)
            {
                return StatusCode(501,"Skill Group can't be null");
            }
            try
            {
                NewSkillGroup skillGroup = new NewSkillGroup();

                skillGroup.SkillGroup = newSkillGroup.SkillGroup;
                skillGroup.Status = "ACTIVE";
                skillGroup.Description = newSkillGroup.Description;
                _dbContext.skill_group.Add(skillGroup);
                _dbContext.SaveChanges();
                return Ok(skillGroup);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillGroup/{id}")]
        public async Task<IActionResult> UpdateSkillGroup(int id)
        {
            try
            {
                var existingSkillGroup = await _dbContext.skill_group.FindAsync(id);

                if (existingSkillGroup == null)
                {
                    return NotFound();
                }

                if (existingSkillGroup.Status == "ACTIVE")
                {

                    var masterSkillGroup = from ss in _dbContext.skill_set
                                       join rs in _dbContext.resource_skill
                                       on ss.SkillSetID equals rs.SkillSetID into detail
                                       from s in detail.DefaultIfEmpty()
                                       select new skillGroupStatus
                                       {
                                           SkillGroupID = ss.SkillGroupID,
                                           SkillSetID = ss.SkillSetID,
                                           res_id = s.res_id
                                       };

                    var resMasterId = _dbContext.resource_master
                        .Where(rm => rm.status == "ACTIVE")
                        .Select(rm => rm.res_id)
                            .ToList();

                    var temp = masterSkillGroup
                    .Where(mg => resMasterId.Contains((int)mg.res_id) && mg.SkillGroupID == id)
                         .ToList();
                            if (temp.Count()!=0)
                    {
                        return StatusCode(502, "Skill Group is in use by Resource");

                    }

                    existingSkillGroup.Status = "INACTIVE";
                }
                else
                {
                    existingSkillGroup.Status = "ACTIVE";
                }

                //_dbContext.Entry(existingSkillGroup).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(existingSkillGroup);
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
                var skillset = (from ss in _dbContext.skill_set
                                join sg in _dbContext.skill_group
                                on ss.SkillGroupID equals sg.SkillGroupID into detail
                                from skillGroup in detail.DefaultIfEmpty()
                                join s in _dbContext._skill
                                on ss.SkillID equals s.SkillID into details
                                from skill in details.DefaultIfEmpty()
                                select new SkillSetManager
                                {
                                    SkillSetID = ss.SkillSetID,
                                    SkillGroupID = skillGroup.SkillGroupID,
                                    SkillID = skill.SkillID,
                                    SkillGroup = skillGroup.SkillGroup,
                                    Skill = skill.Skill,
                                    Description= skill.Description,
                                    status=ss.status
                                }
                                ).ToList();
                return Ok(skillset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet, Authorize]
        [Route("GetActiveSkillSet")]
        public async Task<IActionResult> GetActiveSkillSet()
        {
            try
            {
                var skillset = (from ss in _dbContext.skill_set.Where(st=>st.status=="ACTIVE")
                                join sg in _dbContext.skill_group
                                on ss.SkillGroupID equals sg.SkillGroupID into detail
                                from skillGroup in detail.DefaultIfEmpty()
                                join s in _dbContext._skill
                                on ss.SkillID equals s.SkillID into details
                                from skill in details.DefaultIfEmpty()
                                select new SkillSetManager
                                {
                                    SkillSetID = ss.SkillSetID,
                                    SkillGroupID = skillGroup.SkillGroupID,
                                    SkillID = skill.SkillID,
                                    SkillGroup = skillGroup.SkillGroup,
                                    Skill = skill.Skill,
                                    Description = skill.Description,
                                    status = ss.status
                                }
                                ).ToList();
                return Ok(skillset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpGet]
        [Route("GetResourcesWithSkillCount")]
        public IActionResult GetResourcesWithSkillCount()
        {
            try
            {
                var resourcesWithSkillCount = (from rm in _dbContext.resource_master.Where(s => s.status == "ACTIVE")
                                               join rs in _dbContext.resource_skill on rm.res_id equals rs.res_id into skillDetail
                                               select new ResourceWithSkillCount
                                               {
                                                   res_id = rm.res_id,
                                                   res_name = rm.res_name,
                                                   res_email_id = rm.res_email_id,
                                                   skill_count = skillDetail.Count()
                                               }).ToList();

                return Ok(resourcesWithSkillCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddSkillSet")]
        public IActionResult AddSkillSet([FromBody] SkillSetManager newSet)
        {
            if (newSet.Skill == null||newSet.SkillGroupID==null)
            {
                return StatusCode(501,"Skill Group or Skill can't be null!");
            }
            var skillSets = _dbContext.skill_set.Where(ss => ss.SkillGroupID == newSet.SkillGroupID);
            var skillexist = (from ss in skillSets
                             join s in _dbContext._skill
                             on ss.SkillID equals s.SkillID into detail
                             from sk in detail.DefaultIfEmpty()
                             where sk.Skill.ToUpper().Trim() == newSet.Skill.ToUpper().Trim()
                             select sk
                             ).Any();

            if (skillexist)
            {
                return StatusCode(502, "Skill already exist in the given skill group");

            }

            NewSkills skillForAdd = new NewSkills();
            int? intSkillId = _dbContext._skill.Max(r => (int?)r.SkillID);
            int skillID = (intSkillId is null) ? 0 : (int)intSkillId;
            skillForAdd.SkillID = skillID + 1;
            //skillForAdd.SkillID = _dbContext._skill.Max(r => r.SkillID) + 1;
            skillForAdd.Skill = newSet.Skill.ToUpper().TrimEnd();
            skillForAdd.Status = "ACTIVE";
            skillForAdd.Description= newSet.Description;
            _dbContext._skill.Add(skillForAdd);
            _dbContext.SaveChanges();

            NewSkillSet skillSetForAdd = new NewSkillSet();
            //int? intSkillsetId = _dbContext.skillset.Max(r => (int?)r.SkillSetID);
            //int skillsetID = (intSkillsetId is null) ? 1 : (int)intSkillsetId;
            skillSetForAdd.SkillGroupID = newSet.SkillGroupID;
            //skillSetForAdd.SkillSetID = _dbContext.skill_set.Max(r => r.SkillSetID) + 1;
            skillSetForAdd.SkillID = skillForAdd.SkillID;
            skillSetForAdd.status = "ACTIVE";
            _dbContext.skill_set.Add(skillSetForAdd);
            _dbContext.SaveChanges();
            return Ok(skillSetForAdd);
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillSet")]
        public async Task<IActionResult> UpdateSkillSet([FromBody] SkillSetManager skill)
        {
            try
            {
                var existingSkillSet = await _dbContext.skill_set.FindAsync(skill.SkillSetID);
                if (existingSkillSet == null)
                {
                    return NotFound();
                }
                if (existingSkillSet.status == "INACTIVE")
                {
                    return StatusCode(501, "Can't edit INACTIVE skill");
                }
                var skillSets = _dbContext.skill_set.Where(ss => ss.SkillGroupID == skill.SkillGroupID&&ss.SkillSetID!=skill.SkillSetID);
                var skillexist = (from ss in skillSets
                                  join s in _dbContext._skill
                                  on ss.SkillID equals s.SkillID into detail
                                  from sk in detail.DefaultIfEmpty()
                                  where sk.Skill.ToUpper().Trim() == skill.Skill.ToUpper().Trim()
                                  select sk
                                 ).Any();

                if (skillexist)
                {
                    return StatusCode(502, "Skill already exist in the given skill group");
               
                }


                var updateSkill = await _dbContext._skill.FindAsync(existingSkillSet.SkillID);
                
                existingSkillSet.SkillGroupID = skill.SkillGroupID;
                updateSkill.Skill=skill.Skill;
                updateSkill.Description=skill.Description;

                _dbContext.Entry(existingSkillSet).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return Ok(existingSkillSet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateSkillSetStatus/{id}")]
        public async Task<IActionResult> UpdateSkillSetStatus(int id)
        {
            try
            {
                var existingSkillSet = await _dbContext.skill_set.FindAsync(id);

                if (existingSkillSet == null)
                {
                    return NotFound();
                }

                if (existingSkillSet.status == "ACTIVE")
                {

                    var masterSkillSet = from ss in _dbContext.skill_set.Where(st=>st.status =="ACTIVE")
                                           join rs in _dbContext.resource_skill
                                           on ss.SkillSetID equals rs.SkillSetID into detail
                                           from s in detail.DefaultIfEmpty()
                                           select new skillSetStatus
                                           {
                                               SkillSetID = ss.SkillSetID,
                                               //SkillSetID = ss.SkillSetID,
                                               res_id = s.res_id
                                           };

                    var resMasterId = _dbContext.resource_master
                        .Where(rm => rm.status == "ACTIVE")
                        .Select(rm => rm.res_id)
                            .ToList();

                    var temp = masterSkillSet
                    .Where(mg => resMasterId.Contains((int)mg.res_id) && mg.SkillSetID == id)
                         .ToList();
                    //var temp = resMasterId.ToList().Where(rm => rm.res_id == masterSkillGroup.res_id)

                    if (temp.Count() != 0)
                    {
                        return StatusCode(502,"Skill is in use by Resource");
                        //return BadRequest("SkillGroup is being used and cannot be disabled.");

                    }

                    existingSkillSet.status = "INACTIVE";
                }
                else
                {
                    var existingSkillGroup = await _dbContext.skill_set.FindAsync(existingSkillSet.SkillGroupID);
                    if (existingSkillGroup.status == "ACTIVE")
                    {
                        existingSkillSet.status = "ACTIVE";
                    }
                    else
                        return BadRequest("{\"message\":\"Skill Group is INACTIVE\"}");
                }

                //_dbContext.Entry(existingSkillGroup).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(existingSkillSet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //[HttpDelete, Authorize]
        //[Route("DeleteSkillSet")]
        //public async Task<IActionResult> DeleteSkillSet(SkillSet skill)
        //{
        //    var skills = (from r in _dbContext.resources
        //                  join rs in _dbContext.resourceskills
        //                  on r.ResourceID equals rs.ResourceID
        //                  join ss in _dbContext.skillset
        //                  on rs.SkillSetID equals ss.SkillSetID
        //                  join sg in _dbContext.skillgroup
        //                  on ss.SkillGroupID equals sg.SkillGroupID
        //                  join s in _dbContext.skill
        //                  on ss.SkillID equals s.SkillID
        //                  into detail
        //                  from m in detail.DefaultIfEmpty()
        //                  select new ResourceSkillManager
        //                  {
        //                      ResourceID = r.ResourceID,
        //                      SkillID = ss.SkillID,
        //                      ResourceSkillID = rs.ResourceSkillID,
        //                      SkillSetID = rs.SkillSetID,
        //                      SkillGroupID = sg.SkillGroupID,
        //                      EmailID = r.EmailID,
        //                      SkillGroup = sg.SkillGroup,
        //                      Skill = m.Skill
        //                  }
        //                        ).ToList();

        //    if (!skills.Any(s => s.SkillSetID == skill.SkillSetID))
        //    {
        //        var skillSetToDelete = await _dbContext.skillset.FindAsync(skill.SkillSetID);
        //        if (skillSetToDelete != null)
        //        {
        //            _dbContext.skillset.RemoveRange(skillSetToDelete);
        //            _dbContext.SaveChanges();
        //            Skills skillSet = new Skills();
        //            skillSet.SkillID = skillSetToDelete.SkillID;
        //            _dbContext.skill.RemoveRange(skillSet);
        //            _dbContext.SaveChanges();
        //            }
        //            return Ok("{\"message\": \"Record Deleted Successfully\"}");

        //    }
        //    else
        //    {
        //        return BadRequest("{\"message\":\"This field is used in another process, you can't delete it\"}");
        //    }
        //}

        [HttpGet, Authorize]
        [Route("GetSkill")]
        public async Task<IEnumerable<NewSkills>> GetSkill()
        {
            try
            {
				return await Task.Run(() => _dbContext._skill.AsEnumerable().ToList().DistinctBy(s => s.Skill.ToUpper().Trim()));
			}
			catch (Exception ex)
            {
                return (IEnumerable<NewSkills>)StatusCode(500, ex.Message);
            }
        }



		[HttpPost, Authorize]
        [Route("AddSkill")]
        public async Task<IActionResult> AddSkill(NewSkills skill)
        {
            try
            {
                NewSkills skillForAdd = new NewSkills();
                skillForAdd.Skill = skill.Skill;
                skillForAdd.Status = "ACTIVE";
                skillForAdd.Description = skill.Description;
                _dbContext._skill.Add(skillForAdd);
                _dbContext.SaveChanges();
                return Ok(skillForAdd);
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

        [HttpPost, Authorize]
        [Route("GetSkillAsPerSkillGroup")]
        public async Task<IEnumerable<Skills>> GetSkill([FromBody] NewSkillGroup skillGroup)
        {
            try
            {
                var employee = await (from ss in _dbContext.skill_set.Where(st=>st.status=="ACTIVE")
                                      join s in _dbContext._skill
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

                var skill = employee.Where(e => e.SkillGroupID == skillGroup.SkillGroupID).Select(e => new Skills { SkillID = e.SkillID, Skill = e.Skill }).ToList();

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

        [HttpGet, Authorize]
        [Route("GetResourceAsPerSkillSet/{id}")]
        public async Task<IActionResult> GetResource(int id)
        {
            try
            {
                var data = await (from rs in _dbContext.resource_skill.Where(ss => ss.SkillSetID == id)
                           join r in _dbContext.resource_master
                           on rs.res_id equals r.res_id into detail
                           from m in detail.DefaultIfEmpty()
                           select new ResourceSkillSet
                           {
                               res_id = m.res_id,
                               res_name = m.res_name,
                               SkillSetID = rs.SkillSetID
                           }).ToListAsync();
                           

                    return Ok(data);
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        //[HttpDelete, Authorize]
        //[Route("DeleteSkill")]
        //public async Task<IActionResult> DeleteSkill(Skills skill)
        //{
        //    try
        //    {
        //        SkillSet skillSet = new SkillSet();
        //        skillSet.SkillID = skill.SkillID;
        //        _dbContext.skillset.RemoveRange(skillSet);
        //        _dbContext.SaveChanges();
        //        return Ok("{\"message\": \"Record Deleted Successfully\"}");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message);
        //    }
        //}
    }
}