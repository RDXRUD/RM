using ResourceManagerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ResourceManagerAPI.DBContext
{
    public class PGDBContext : DbContext
    {
        public PGDBContext(DbContextOptions<PGDBContext> options) : base(options)
        {

        }
        public virtual DbSet<EmployeeTasks> employeetasks { get; set; } = null!;
        public virtual DbSet<Employee> employees { get; set; } = null!;
        public virtual DbSet<Skills> skills { get; set; } = null!;
        public virtual DbSet<EmployeeSkills> employeeskills { get; set; } = null!;
        public virtual DbSet<Users> users { get; set; } = null!;
        public virtual DbSet<SkillSet> skillset { get; set; } = null!;

    }

}
