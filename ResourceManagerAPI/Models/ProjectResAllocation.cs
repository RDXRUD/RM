using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class ProjectResAllocation
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("project_id")]
        public int project_id { get; set; }
        [ForeignKey("res_id")]
        public int res_id { get; set; }
        [ForeignKey("skill_id")]
        public int skill_id { get; set; }
        public float allocation_perc { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
            
    }
}
