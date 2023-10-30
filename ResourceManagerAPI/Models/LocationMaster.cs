using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class LocationMaster
    {
        [Key]
        public int id { get; set; }
        public string location { get; set; }
    }
}
