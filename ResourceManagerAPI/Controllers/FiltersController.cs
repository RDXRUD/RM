using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.Models;
using loggerservice;
namespace ResourceManagerAPI.Controllers
{

    [Route("api/[controller]")]
    //[Route("api/[controller]/[action]")]
    [ApiController]
    public class FiltersController : Controller
    {
        private readonly EmployeeDBContext _context;
        public FiltersController(EmployeeDBContext context)
        {
            _context = context;
        }

       

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employees = await _context.employee.FindAsync(id);

            if (employees == null)
            {
                return NotFound();
            }
            return employees;
        }


        [HttpGet, Route("GetEmployeeByname")]
        public List<Employee> GetEmployeeByname(string name)
        {
            var employees = (from e in _context.employee
                             where e.name.ToLower() == name.ToLower()
                             select e).ToList();



            return employees;
        }

        [HttpGet, Route("GetEmployeeByEmail")]
        public List<Employee> GetEmployeeByEmail(string email)
        {
            var employees = (from e in _context.employee
                             where e.email_address.ToLower() == email.ToLower()
                             select e).ToList();



            return employees;
        }

        [HttpGet, Route("GetEmployeeByTaskName")]
        public List<Employee> GetEmployeeByTaskName(string task)
        {
            var employees = (from e in _context.employee
                             where e.task_name.ToLower() == task.ToLower()
                             select e).ToList();



            return employees;
        }

        [HttpGet, Route("GetEmployeeByStartDate")]
        public List<Employee> GetEmployeeByStartDate(string Start)
        {
            var employees = (from e in _context.employee
                             where e.start.ToLower() == Start.ToLower()
                             select e).ToList();



            return employees;
        }

        [HttpGet, Route("GetEmployeeByFinishDate")]
        public List<Employee> GetEmployeeByFinishDate(string Finish)
        {
            var employees = (from e in _context.employee
                             where e.finish.ToLower() == Finish.ToLower()
                             select e).ToList();



            return employees;
        }
        private readonly SkillDBContext __context;
        //public FiltersController(SkillDBContext context)
        //{
        //    __context = context;
        //}

        [HttpGet, Route("GetEmployeeBySkillGroup")]
        public List<Skill> GetEmployeeBySkillGroup(string SkillGroup)
        {
            var employees = (from m in __context.skill
                             where m.skill_group.ToLower() == SkillGroup.ToLower()
                             select m).ToList();



            return employees;
        }

        [HttpGet, Route("GetEmployeeBySkillName")]
        public List<Skill> GetEmployeeBySkillName(string SkillName)
        {
            var employees = (from m in __context.skill
                             where m.skill.ToLower() == SkillName.ToLower()
                             select m).ToList();



            return employees;
        }


    }
}
