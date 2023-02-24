using ResourceManagerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;

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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var employee = (from e in _dbContext.employeetasks
                            join s in _dbContext.employees
                            on e.EmpID equals s.EmpID
                            into detail
                            from m in detail.DefaultIfEmpty()

                            select new EmployeeManager
                            {
                                EmpID = m.EmpID,
                                ResourceName = m.ResourceName,
                                EmailID = m.EmailID,
                                TaskName = e.TaskName,
                                Start = e.Start,
                                Finish = e.Finish
                            }

                            ).ToList();
            return Ok(employee);
        }
    }
}
