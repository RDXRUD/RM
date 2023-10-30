using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class ProjectStatus
    {
        [Key]
        public int id { get; set; }
        public string project_status { get; set; }
    }
}
