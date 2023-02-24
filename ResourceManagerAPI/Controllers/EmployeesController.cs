using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;

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

        [HttpGet]
        public async Task<IEnumerable<Employee>> Get()
        {
            return await _dbContext.employees.ToListAsync();
        }
    }
}
