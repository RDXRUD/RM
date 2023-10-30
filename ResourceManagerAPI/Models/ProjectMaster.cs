using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class ProjectMaster
    {
        [Key]
        public int project_id { get; set; }
        [ForeignKey("client_id")]
        public int client_id { get; set; }
        public string project_name { get; set; }
        [ForeignKey("project_manager")]
        public int project_manager { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        [ForeignKey("project_type")]
        public int project_type { get; set; }
        [ForeignKey("project_status")]
        public int project_status { get; set; }

    }
}
