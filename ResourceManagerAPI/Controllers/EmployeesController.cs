using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using Microsoft.AspNetCore.Authorization;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly PGDBContext _dbContext;

        public EmployeesController(PGDBContext context)
        {
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("GetEmployees")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var employees = await _dbContext.employees.ToListAsync();
                return Ok(employees); // Return a 200 OK response with the data
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return a 500 Internal Server Error with the error message
            }
        }


        [HttpPost, Authorize]
        [Route("AddEmployee")]
        public async Task<IActionResult> AddEmployee([FromBody] Employee employee)
        {
            try
            {
                if (employee == null)
                {
                    return BadRequest("Employee data is null.");
                }
                Resources resource = new Resources();

                resource.ResourceID = await _dbContext.resources.MaxAsync(r => r.ResourceID) + 1;
                employee.EmpID = await _dbContext.employees.MaxAsync(e => e.EmpID) + 1;
                resource.EmailID = employee.EmailID;
                _dbContext.resources.Add(resource);
                _dbContext.employees.Add(employee);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction("AddEmployee", new { id = employee.EmpID }, employee);
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
        [Route("EditEmployee/{id}")]
        public async Task<IActionResult> EditEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            Resources resource = new Resources();
            try
            {
                if (updatedEmployee == null)
                {
                    return BadRequest("Employee data is null.");
                }

                var existingEmployee = await _dbContext.employees.FindAsync(id);

                if (existingEmployee == null)
                {
                    return NotFound($"Employee with ID {id} not found.");
                }

                if (existingEmployee.EmailID != updatedEmployee.EmailID)
                {
                    // Email ID is being updated, so updating the corresponding Resource
                    var existingResource = await _dbContext.resources
                        .FirstOrDefaultAsync(r => r.EmailID == existingEmployee.EmailID);

                    if (existingResource != null)
                    {
                        existingResource.EmailID = updatedEmployee.EmailID;
                    }
                }

                // Update employee details
                existingEmployee.ResourceName = updatedEmployee.ResourceName;
                existingEmployee.EmailID = updatedEmployee.EmailID;
                existingEmployee.Location = updatedEmployee.Location;
                existingEmployee.Status = updatedEmployee.Status;

                // Save changes
                await _dbContext.SaveChangesAsync();

                return Ok(existingEmployee);
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

        [HttpDelete, Authorize]
        [Route("DeleteEmployee/{id}")]
        [NonAction]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employeeToDelete = await _dbContext.employees.FindAsync(id);

                if (employeeToDelete == null)
                {
                    return NotFound($"Employee with ID {id} not found.");
                }

                _dbContext.employees.Remove(employeeToDelete);
                await _dbContext.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                // Handle the exception as needed
                return StatusCode(500, "An error occurred while deleting the employee.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


    }
}
