using ResourceManagerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ResourceManagerAPI.DBContext
{
    public class PGDBContext : DbContext
    {
        public PGDBContext(DbContextOptions<PGDBContext> options) : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }
        public virtual DbSet<EmployeeTasks> employeetasks { get; set; }
        public virtual DbSet<Employee> employees { get; set; }
        public virtual DbSet<ResourceSkills> resourceskills { get; set; }
        public virtual DbSet<Resources> resources { get; set; }
        public virtual DbSet<Users> users { get; set; }
        public virtual DbSet<SkillSet> skillset { get; set; }
        public virtual DbSet<SkillGroups> skillgroup { get; set; }
        public virtual DbSet<Skills> skill { get; set; }
        public virtual DbSet<PlanUploadRecord> uploadrecord { get; set; }
    }
}

