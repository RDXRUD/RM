using javax.xml.soap;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Data.Entity;
using System.Globalization;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public ProjectController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("ProjectManagers")]
        public async Task<IEnumerable<ProjectManager>> GetProjectManagers()
        {
            try
            {

                var PMs = _dbContext.resource_skill.Where(skill => skill.SkillSetID == 6).ToList();
                var PMDetails = (from p in PMs
                                 join r in _dbContext.resource_master
                                      on p.res_id equals r.res_id into rDetails
                                      from re in rDetails.DefaultIfEmpty()
                                      select new ProjectManager
                                      {
                                          res_id=re.res_id,
                                          res_name=re.res_name

                                      }).ToList();
                return PMDetails;
            }
            catch (Exception ex)
            {
                return (IEnumerable<ProjectManager>)StatusCode(500, ex.Message);
            }
        }

        [HttpGet]//, Authorize
        [Route("Projects")]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                return Ok(_dbContext.project_master.ToList());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("ClientProjects/{id}")]
        public async Task<IEnumerable<ProjectDetails>> GetClientProjects(int id)
        {
            try
            {
                
                var projects= _dbContext.project_master.Where(project => project.client_id == id).ToList();
                var projectDetails = (from p in projects
                                      join r in _dbContext.resource_master
                                      on p.project_manager equals r.res_id into rDetails
                                      from re in rDetails.DefaultIfEmpty()
                                      join ps in _dbContext.project_status
                                      on p.project_status equals ps.id into sDetails
                                      from st in sDetails.DefaultIfEmpty()
                                      join pt in _dbContext.project_type
                                      on p.project_type equals pt.project_type_id into tDetails
                                      from ty in tDetails.DefaultIfEmpty()
                                      join c in _dbContext.client_master
                                      on id equals c.client_id into details
                                      from cl in details.DefaultIfEmpty()
                                      select new ProjectDetails
                                      {
                                          client_id = cl.client_id,
                                          client_name = cl.client_name,
                                          project_id=p.project_id,
                                          project_name=p.project_name,
                                          project_manager=p.project_manager,
                                          res_name=re.res_name,
                                          start_date=p.start_date,
                                          end_date=p.end_date,
                                          project_status=p.project_status,
                                          status=st.project_status,
                                          project_type=p.project_type,
                                          type=ty.type,


                                      }).ToList();
                return projectDetails;
            }
            catch (Exception ex)
            {
                return (IEnumerable<ProjectDetails>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddProject")]
        public IActionResult AddProject(ProjectMaster newProject)
        {

            try
            {
                ProjectStatus projStatus  = new ProjectStatus();
                ProjectResAllocation resource = new ProjectResAllocation();
                if (newProject == null || newProject.project_name == null)
                {
                    return StatusCode(501, "Project Name can't be null");
                }
                var testName = _dbContext.project_master.Where(project => (project.project_name.ToUpper()) == newProject.project_name.ToUpper().Trim()&&project.client_id==newProject.client_id).FirstOrDefault();
                if (testName != null)
                {
                    return StatusCode(502, "Project Name already exist");
                }
                //projStatus =  _dbContext.project_status.Where(ps => ps.project_status == "Ongoing").FirstOrDefault();

                //var testPM= _dbContext.project_master.Where(project => project.project_manager==newProject.project_manager && 
                //                                    project.project_status==projStatus.id &&
                //                                    newProject.project_status==projStatus.id
                //                                    ).FirstOrDefault();
                //if (testPM != null)
                //{
                //    return StatusCode(502, "PM is already alloted to an ongoing project ");
                //}
                if (newProject.start_date > newProject.end_date)
                {
                    return StatusCode(502, "End date can't be before start date");
                }

                newProject.project_name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(newProject.project_name);//Formatting Client Name
                resource.res_id = newProject.project_manager;
                resource.skill_id = 6;//from database table skill_set PM id
                resource.start_date=newProject.start_date;
                resource.end_date=newProject.end_date;
                resource.allocation_perc = 1;

                _dbContext.project_master.Add(newProject);
                _dbContext.SaveChanges();
                resource.project_id = _dbContext.project_master.Max(p => (p.project_id));
                _dbContext.project_res_allocation.Add(resource);
                _dbContext.SaveChanges();
                return Ok(newProject);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut, Authorize]
        [Route("UpdateProject/{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectMaster updatedProject)
        {

            try
            {
                ProjectStatus projStatus = new ProjectStatus();
                if (updatedProject == null)
                {
                    return BadRequest("Project data is null.");
                }

                var existingProject = await _dbContext.project_master.FindAsync(id);
                
                if (existingProject == null)
                {
                    return NotFound($"Project with ID {id} not found.");
                }
                var testName = _dbContext.project_master.Where(project => project.project_name.ToUpper() == updatedProject.project_name.ToUpper().Trim() && 
                                                        project.client_id == updatedProject.client_id && 
                                                        updatedProject.project_name.ToUpper().Trim() != existingProject.project_name.ToUpper()
                                                        ).FirstOrDefault();
                if (testName != null)
                {
                    return StatusCode(502, "Project Name already exist");
                }
   
               //projStatus = _dbContext.project_status.FirstOrDefault(ps => ps.project_status == "Ongoing");

               // var testPM = _dbContext.project_master.FirstOrDefault(project => project.project_manager == updatedProject.project_manager &&
               //                                          project.project_status == projStatus.id &&
               //                                          updatedProject.project_status == projStatus.id
               //                                          );
               // if (testPM != null)
               // {
               //     return StatusCode(502, "PM is already alloted to an ongoing project ");
               // }

                var existingResource = _dbContext.project_res_allocation.FirstOrDefault(r => r.res_id == existingProject.project_manager &&
                                                                                    r.project_id == existingProject.project_id
                                                                                    );


                existingProject.project_name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(updatedProject.project_name);
                existingProject.project_manager = updatedProject.project_manager;
                existingProject.start_date = updatedProject.start_date;
                existingProject.end_date = updatedProject.end_date;
                existingProject.project_status = updatedProject.project_status;
                existingProject.project_type = updatedProject.project_type;
                existingResource.res_id = updatedProject.project_manager;
                existingResource.start_date = updatedProject.start_date;
                existingResource.end_date = updatedProject.end_date;

                await _dbContext.SaveChangesAsync();

                return Ok(existingProject);
            }

            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while updating project details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("GetProjectType")]
        public async Task<IActionResult> GetProjectType()
        {
            try
            {
                var projectType = _dbContext.project_type.ToList();
                return Ok(projectType); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }


        [HttpGet, Authorize]
        [Route("GetProjectStatus")]
        public async Task<IActionResult> GetProjectStatus()
        {
            try
            {
                var projectStatus = _dbContext.project_status.ToList();
                return Ok(projectStatus); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }

        [HttpGet, Authorize]
        [Route("GetAllocatedResource/{id}")]
        public async Task<IActionResult> GetResource(int id)
        {
            try
            {

                var resources = _dbContext.project_res_allocation.Where(res => res.project_id == id).ToList();
                var resourceDetails = (from re in resources
                                       join r in _dbContext.resource_master
                                      on re.res_id equals r.res_id into rDetails
                                      from res in rDetails.DefaultIfEmpty()
                                      join ss in _dbContext.skill_set
                                      on re.skill_id equals ss.SkillSetID into ssDetails
                                      from s in ssDetails.DefaultIfEmpty()
                                      join sk in _dbContext._skill
                                      on s.SkillID equals sk.SkillID into sDetails
                                      from det in sDetails.DefaultIfEmpty()
                                      select new ResAllocationDetails
                                      {
                                          id=re.id,
                                          project_id=re.project_id,
                                          res_id=res.res_id,
                                          res_name=res.res_name,
                                          skill_id=re.skill_id,
                                          skillID=s.SkillID,
                                          skill=det.Skill,
                                          start_date=re.start_date,
                                          end_date=re.end_date,
                                          allocation_perc=re.allocation_perc


                                      }).ToList();
                return Ok(resourceDetails); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }

        [HttpPost, Authorize]
        [Route("AllocateResource")]
        public IActionResult AllocateResource([FromBody] ProjectResAllocation resource)
        {

            try
            {
                if (resource == null)
                {
                    return StatusCode(501, " Can't be null");
                }

                var project = _dbContext.project_master.Where(project => (project.project_id) == resource.project_id).FirstOrDefault();
                if (resource.start_date < project.start_date || resource.end_date > project.end_date||resource.end_date<resource.start_date)
                {
                    return StatusCode(503, "time period is out of project duration");
                }

                //var Records = (from r in _dbContext.project_res_allocation
                //                         join p in _dbContext.project_master
                //                         on r.project_id equals p.project_id into pDetails
                //                         from ps in pDetails.DefaultIfEmpty()
                //                         join s in _dbContext.project_status
                //                         on ps.project_status equals s.id into psDetails
                //                         from det in psDetails.Where(d => d.project_status != "Completed").DefaultIfEmpty()
                //                         select new ProjectResAllocation
                //                         {
                //                             id = r.id,
                //                             project_id=r.project_id,
                //                             res_id=r.res_id,
                //                             allocation_perc=r.allocation_perc,
                //                             end_date=r.end_date,
                //                             skill_id=r.skill_id,
                //                             start_date=r.start_date

                //                         }).ToList();

                //var status = (from p in _dbContext.project_master.Where(p => p.project_id == resource.project_id)
                //              join ps in _dbContext.project_status
                //              on p.project_status equals ps.id into detail
                //              from d in detail
                //              select d.project_status).FirstOrDefault();

                // var allocatedRecords= _dbContext.project_res_allocation.Where(r => r.res_id == resource.res_id &&
                //             r.start_date <= resource.end_date &&
                //             r.end_date >= resource.start_date&&status!="Completed").ToList();

                //float allocPerc = allocatedRecords.Sum(perc => perc.allocation_perc);

                //if (allocPerc == 1)
                //{
                //    return StatusCode(503, "Resource is already 100% allocated"); 
                //}
                //if (allocPerc + resource.allocation_perc > 1)
                //{
                //    return StatusCode(503, "Resource does not have enough allocation left");
                //}

                _dbContext.project_res_allocation.Add(resource);
                _dbContext.SaveChanges();
                return Ok(resource);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateAllocatedResource/{id}")]
        public async Task<IActionResult> UpdateResource(int id, [FromBody] ProjectResAllocation updatedResource)
        {

            try
            {
                ProjectStatus projStatus = new ProjectStatus();
                if (updatedResource == null)
                {
                    return BadRequest("Resource data is null.");
                }

                var existingResource = await _dbContext.project_res_allocation.FindAsync(id);
                if (existingResource == null)
                {
                    return NotFound($"ResourceAllocated with ID {id} not found.");
                }

                var project = _dbContext.project_master.Where(p => p.project_id == updatedResource.project_id).FirstOrDefault();
                if (updatedResource.start_date < project.start_date || updatedResource.end_date > project.end_date)
                {
                    return StatusCode(503, "time period is out of project duration");
                }

                //var Records = (from r in _dbContext.project_res_allocation
                //               join p in _dbContext.project_master
                //               on r.project_id equals p.project_id into pDetails
                //               from ps in pDetails.DefaultIfEmpty()
                //               join s in _dbContext.project_status
                //               on ps.project_status equals s.id into psDetails
                //               from det in psDetails.Where(d => d.project_status != "Completed").DefaultIfEmpty()
                //               select new ProjectResAllocation
                //               {
                //                   id = r.id,
                //                   project_id = r.project_id,
                //                   res_id = r.res_id,
                //                   allocation_perc = r.allocation_perc,
                //                   end_date = r.end_date,
                //                   skill_id = r.skill_id,
                //                   start_date = r.start_date

                //               }).ToList();

                //var status = (from p in _dbContext.project_master.Where(p => p.project_id == updatedResource.project_id)
                //              join ps in _dbContext.project_status
                //              on p.project_status equals ps.id into detail
                //              from d in detail
                //              select d.project_status).FirstOrDefault();

                //var allocatedRecords = _dbContext.project_res_allocation.Where(r => r.res_id == updatedResource.res_id &&
                //            r.start_date <= updatedResource.end_date &&
                //            r.end_date >= updatedResource.start_date && status != "Completed"&&r.id!=id).ToList();

                //float allocPerc = allocatedRecords.Sum(perc => perc.allocation_perc);

                //if (allocPerc == 1)
                //{
                //    return StatusCode(503, "Resource is already 100% allocated");
                //}
                //if (allocPerc + updatedResource.allocation_perc > 1)
                //{
                //    return StatusCode(503, "Resource does not have enough allocation left");
                //}

                existingResource.res_id = updatedResource.res_id;
                existingResource.start_date = updatedResource.start_date;
                existingResource.end_date = updatedResource.end_date;
                existingResource.skill_id = updatedResource.skill_id;
                existingResource.allocation_perc = updatedResource.allocation_perc;
               

                await _dbContext.SaveChangesAsync();

                return Ok(existingResource);
            }

            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while updating project details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete, Authorize]
        [Route("DeleteResource/{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            try
            {
                var existingResource = await _dbContext.project_res_allocation.FindAsync(id);
                _dbContext.project_res_allocation.RemoveRange(existingResource);
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
