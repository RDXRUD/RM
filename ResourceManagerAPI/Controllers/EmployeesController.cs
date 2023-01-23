using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeDBContext _context;

        public EmployeesController(EmployeeDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Employee>> Get()
        {
            return await _context.employee.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id < 1)
                return BadRequest();
            var employee = await _context.employee.FirstOrDefaultAsync(m => m.ID == id);
            if (employee == null)
                return NotFound();
            return Ok(employee);

        }

        [HttpPost]
        public async Task<IActionResult> Post(Employee employee)
        {
            _context.Add(employee);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Employee employeeData)
        {
            if (employeeData == null || employeeData.ID == 0)
                return BadRequest();

            var employee = await _context.employee.FindAsync(employeeData.ID);
            if (employee == null)
                return NotFound();
            employee.name = employeeData.name;
            employee.email_address = employeeData.email_address;
            employee.task_name = employeeData.task_name;
            employee.start = employeeData.start;
            employee.finish = employeeData.finish;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id < 1)
                return BadRequest();
            var employee = await _context.employee.FindAsync(id);
            if (employee == null)
                return NotFound();
            _context.employee.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok();

        }
    }
}