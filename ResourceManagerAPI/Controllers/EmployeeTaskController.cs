using ResourceManagerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using Microsoft.AspNetCore.Authorization;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeTaskController : ControllerBase
    {
        private readonly PGDBContext _dbContext;

        public EmployeeTaskController(PGDBContext context)
        {
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("GetEmployeesTask")]
        public IActionResult GetEmployeeTasks()
        {
            try
            {
                var employee = (from e in _dbContext.employeetasks
                                join s in _dbContext.employees
                                on e.EmpID equals s.EmpID
                                select new EmployeeManager
                                {
                                    EmpID = e.EmpID,
                                    ResourceName = s.ResourceName,
                                    EmailID = s.EmailID,
                                    TaskName = e.TaskName,
                                    Start = e.Start,
                                    Finish = e.Finish
                                }
                                ).ToList();

                if (employee == null)
                {
                    return NotFound();
                }
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost, Authorize]
        [Route("AddEmployeesTask")]
        [NonAction]
        public async Task<IActionResult> AddEmployeeTasks(EmployeeManager employee)
        {
            try
            {
                EmployeeTasks empTask = new EmployeeTasks();
                //empTask.EmpID = employee.EmpID;
                empTask.TaskName = employee.TaskName;
                empTask.Start = employee.Start;
                empTask.Finish = employee.Finish;
                _dbContext.employeetasks.Add(empTask);
                _dbContext.SaveChanges();

                Employee employees = new Employee();
                //employees.EmpID = employee.EmpID;
                employees.ResourceName = employee.ResourceName;
                employees.EmailID = employee.EmailID;
                _dbContext.employees.Add(employees);
                _dbContext.SaveChanges();
                return Ok("{\"message\": \"Record Added Successfully\"}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpPut, Authorize]
        [NonAction]
        [Route("UpdateEmployeeTask")]
        public async Task<IActionResult> UpdateEmployeesTask(EmployeeManager employee)
        {
            try
            {
                EmployeeTasks EmpTask = new EmployeeTasks();
                EmpTask.EmpID = employee.EmpID;
                EmpTask.TaskName = employee.TaskName;
                EmpTask.Start = employee.Start;
                EmpTask.Finish = employee.Finish;
                _dbContext.employeetasks.Add(EmpTask);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}
