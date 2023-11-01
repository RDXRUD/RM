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
        public virtual DbSet<ResourceMaster> resource_master { get; set; }
        public virtual DbSet<LocationMaster> location_master { get; set; }
        public virtual DbSet<RoleMaster> role_master { get; set; }
        public virtual DbSet<ResourceRole> resource_role { get; set; }
        public virtual DbSet<NewSkills> _skill { get; set; }
        public virtual DbSet<NewSkillGroup> skill_group { get; set; }
        public virtual DbSet<NewSkillSet> skill_set { get; set; }
        public virtual DbSet<NewResourceSkills> resource_skill { get; set; }
        public virtual DbSet<Client> client_master { get; set; }
        public virtual DbSet<ProjectStatus> project_status { get; set; }
        public virtual DbSet<ProjectType> project_type { get; set; }
        public virtual DbSet<ProjectMaster> project_master { get; set; }
        public virtual DbSet<ProjectResAllocation> project_res_allocation { get; set; }
        public virtual DbSet<DateMaster> date_master { get; set; }
        public virtual DbSet<CrossViewData> cross_view_data { get; set; }
        public virtual DbSet<CrossJoin> cross_view_join { get; set; }

    }
}