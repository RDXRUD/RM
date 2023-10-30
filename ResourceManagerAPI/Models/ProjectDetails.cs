using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class ProjectDetails
    {
        
        public int project_id { get; set; }
        public int client_id { get; set; }
        public string client_name { get; set; }
        public string project_name { get; set; }
        public int project_manager { get; set; }
        public string res_name { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public int project_type { get; set; }
        public string type { get; set; }
        public int project_status { get; set; }
        public string status { get; set; }
    }
}
