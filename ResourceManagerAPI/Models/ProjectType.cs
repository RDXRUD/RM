using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class ProjectType
    {
        [Key]
        public int project_type_id { get; set; }
        public string type { get; set; }
        public string status { get; set; }

    }
}
