using com.sun.tools.javac.comp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using net.sf.mpxj.ganttproject.schema;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Diagnostics;
using System.Globalization;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;
using Resources = ResourceManagerAPI.Models.Resources;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourcesController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public ResourcesController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("GetResources")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var resources = (from rm in _dbContext.resource_master.Where(s => s.status == "ACTIVE")
                                 join lm in _dbContext.location_master
                                 on rm.location_id equals lm.id into locationDetail
                                 from m in locationDetail.DefaultIfEmpty()
                                 join rr in _dbContext.resource_role
                                 on rm.res_id equals rr.resource_id into roleDetail
                                 from r in roleDetail.DefaultIfEmpty()
                                 join role in _dbContext.role_master
                                 on r.role_id equals role.role_id into roleMasterDetail
                                 from roleM in roleMasterDetail.DefaultIfEmpty()
                                 select new ResourceLocation
                                 {
                                     res_id = rm.res_id,
                                     res_name = rm.res_name,
                                     res_email_id = rm.res_email_id,
                                     res_user_id = rm.res_user_id,
                                     res_create_date = rm.res_create_date,
                                     res_last_modified = rm.res_last_modified,
                                     sso_flag = rm.sso_flag,
                                     location = m.location,
                                     role_name = roleM.role_name
                                 }
                                ).ToList();//await _dbContext.resource_master.ToListAsync();
                return Ok(resources); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }

        [HttpGet, Authorize]
        [Route("GetResource/{userID}")]
        public async Task<IActionResult> GetResource(string userID)
        {
            try
            {
                var resources = (from rm in _dbContext.resource_master.Where(s => s.res_user_id == userID)
                                 join lm in _dbContext.location_master
                                 on rm.location_id equals lm.id into detail
                                 from m in detail.DefaultIfEmpty()
                                 join rr in _dbContext.resource_role
                                 on rm.res_id equals rr.resource_id into roleDetail
                                 from r in roleDetail.DefaultIfEmpty()
                                 join role in _dbContext.role_master
                                 on r.role_id equals role.role_id into roleMasterDetail
                                 from roleM in roleMasterDetail.DefaultIfEmpty()
                                     //orderby rm.res_id
                                 select new ResourceLocation
                                 {
                                     res_id = rm.res_id,
                                     res_name = rm.res_name,
                                     res_email_id = rm.res_email_id,
                                     res_user_id = rm.res_user_id,
                                     res_create_date = rm.res_create_date,
                                     res_last_modified = rm.res_last_modified,
                                     sso_flag = rm.sso_flag,
                                     location = m.location,
                                     role_name = roleM.role_name

                                 }
                                ).ToList();//await _dbContext.resource_master.ToListAsync();
                //resources = resources.OrderBy(r => r.res_user_id).ToList();
                return Ok(resources); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }


        [HttpPost, Authorize]
        [Route("AddResource")]
        public async Task<IActionResult> AddResource([FromBody] ResourceLocation resLoc)
        {
            try
            {
                if (resLoc == null)
                {
                    return BadRequest("Employee data is null.");
                }
                Resources res = new Resources();
                ResourceMaster resource = new ResourceMaster();
                RoleMaster roles = new RoleMaster();
                ResourceRole resRole = new ResourceRole();
                Login user = new Login();
                var testEmail = await _dbContext.resource_master.Where(e => e.res_email_id.ToLower().Trim() == resLoc.res_email_id.ToLower().Trim()).FirstOrDefaultAsync();
                if (testEmail != null)
                {
                    return StatusCode(501, "Email already exist");
                }
                var testUserID = await _dbContext.resource_master.Where(id => id.res_user_id.ToLower().Trim() == resLoc.res_user_id.ToLower().Trim()).FirstOrDefaultAsync();
                if (testUserID != null)
                {
                    return StatusCode(502, "UserID already exist");
                }
                resLoc.res_id = await _dbContext.resource_master.MaxAsync(r => r.res_id) + 1;
                res.EmailID = resLoc.res_email_id;
                resource.res_name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(resLoc.res_name);

                resource.res_user_id = resLoc.res_user_id.ToLower();
                resource.res_email_id = resLoc.res_email_id.ToLower();
                //resource.sso_flag = resLoc.sso_flag;
                resource.sso_flag = 1;
                resource.res_last_modified = DateTime.UtcNow.Date;
                var temp = _dbContext.location_master.FirstOrDefault(l => l.location == resLoc.location);
                resource.location_id = temp.id;
                var test = _dbContext.role_master.FirstOrDefault(l => l.role_name == resLoc.role_name);
                resRole.resource_id = await _dbContext.resource_master.MaxAsync(r => r.res_id) + 1;
                resRole.role_id = test.role_id;
                user.UserID = resLoc.res_user_id;
                user.Password = resLoc.password;
                resource.password = _account.ResourcePass(user);
                _dbContext.resource_master.Add(resource);
                _dbContext.resource_role.Add(resRole);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction("AddResource", new { id = resource.res_id }, resource);
            }
            catch (DbUpdateException ex)
            {
                // Handle the exception as needed
                return StatusCode(500, "An error occurred while saving the entity changes.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut, Authorize]
        [Route("EditResource/{id}")]
        public async Task<IActionResult> EditResource(int id, [FromBody] EditResource updatedResource)
        {
            Resources resource = new Resources();
            try
            {
                if (updatedResource == null)
                {
                    return BadRequest("Employee data is null.");
                }

                var existingResource = await _dbContext.resource_master.FindAsync(id);
                var existingRole = await _dbContext.resource_role.FirstOrDefaultAsync(r => r.resource_id == id);
                if (existingResource == null)
                {
                    return NotFound($"Employee with ID {id} not found.");
                }
                var testEmail = await _dbContext.resource_master.Where(e => (e.res_email_id) == updatedResource.res_email_id && updatedResource.res_email_id != existingResource.res_email_id).FirstOrDefaultAsync();
                if (testEmail != null)
                {
                    return StatusCode(501, "Email already exist");
                }
                var testUserID = await _dbContext.resource_master.Where(id => (id.res_user_id) == updatedResource.res_user_id && updatedResource.res_user_id != existingResource.res_user_id).FirstOrDefaultAsync();
                if (testUserID != null)
                {
                    return StatusCode(502, "UserID already exist");
                }

                if (existingResource.res_email_id != updatedResource.res_email_id)
                {

                    resource.EmailID = updatedResource.res_email_id;
                    existingResource.res_email_id = updatedResource.res_email_id;
                }

                // Update employee details
                existingResource.res_name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(updatedResource.res_name);
                existingResource.res_user_id = updatedResource.res_user_id;
                var temp = _dbContext.location_master.FirstOrDefault(l => l.location == updatedResource.location);
                existingResource.location_id = temp.id;
                var test = _dbContext.role_master.FirstOrDefault(l => l.role_name == updatedResource.role_name);
                if (existingRole == null)
                {
                    existingRole.resource_id = id;
                    existingRole.role_id = test.role_id;
                    _dbContext.resource_role.Add(existingRole);

                }
                else existingRole.role_id = test.role_id;

                existingResource.sso_flag = 1;
                existingResource.res_last_modified = DateTime.UtcNow.Date;

                // Save changes
                await _dbContext.SaveChangesAsync();

                return Ok(existingResource);
            }

            catch (DbUpdateException ex)
            {
                // Handle the exception as needed
                return StatusCode(500, "An error occurred while updating employee details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("EditStatus/{id}")]
        public async Task<IActionResult> EditStatus(int id)
        {
            try
            {

                var existingResource = await _dbContext.resource_master.FindAsync(id);

                if (existingResource == null)
                {
                    return NotFound($"Resource with ID {id} not found.");
                }

                // Update employee details
                existingResource.status = "INACTIVE";
                existingResource.res_last_modified = DateTime.UtcNow.Date;

                // Save changes
                await _dbContext.SaveChangesAsync();

                return Ok(existingResource);
            }

            catch (DbUpdateException ex)
            {
                // Handle the exception as needed
                return StatusCode(500, "An error occurred while updating employee details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("ResetPassword/{userID}")]
        public async Task<IActionResult> ResetPassword(string userID, [FromBody] Login updatedResource)
        {
            try
            {
                var userName = User.Identity.Name;
                var existingResource = await _dbContext.resource_master.Where(id => (id.res_user_id) == updatedResource.UserID).FirstOrDefaultAsync();

                if (existingResource == null)
                {
                    return NotFound($"Resource with ID {userID} not found.");
                }

                updatedResource.UserID = existingResource.res_user_id;

                if (existingResource.res_user_id == UserController.userName)
                {
                    Debug.WriteLine(userName);
                    //updatedResource.Password = updatedResource.password;
                    existingResource.password = _account.ResourcePass(updatedResource);
                    existingResource.res_last_modified = DateTime.UtcNow.Date;

                    // Save changes
                    await _dbContext.SaveChangesAsync();
                    return Ok(existingResource);
                }
                else
                {
                    return StatusCode(505, "Session expire, Login again!");
                }

            }

            catch (DbUpdateException ex)
            {
                // Handle the exception as needed
                return StatusCode(500, "An error occurred while updating resource details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        //[HttpDelete, Authorize]
        //[Route("DeleteEmployee/{id}")]
        //[NonAction]
        //public async Task<IActionResult> DeleteEmployee(int id)
        //{
        //    try
        //    {
        //        var employeeToDelete = await _dbContext.employees.FindAsync(id);

        //        if (employeeToDelete == null)
        //        {
        //            return NotFound($"Employee with ID {id} not found.");
        //        }

        //        _dbContext.employees.Remove(employeeToDelete);
        //        await _dbContext.SaveChangesAsync();

        //        return NoContent();
        //    }
        //    catch (DbUpdateException ex)
        //    {
        //        // Handle the exception as needed
        //        return StatusCode(500, "An error occurred while deleting the employee.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message);
        //    }
        //}

        [HttpGet, Authorize]
        [Route("GetLocations")]
        public async Task<IActionResult> GetLocations()
        {
            try
            {
                var location = await _dbContext.location_master.ToListAsync();
                return Ok(location); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }

        [HttpGet, Authorize]
        [Route("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _dbContext.role_master.ToListAsync();
                return Ok(roles); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }


    }
}