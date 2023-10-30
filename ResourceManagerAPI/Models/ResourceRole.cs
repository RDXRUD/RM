using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace ResourceManagerAPI.Models
{
    public class ResourceRole
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("resource_id")]
        public int resource_id { get; set; }
        [ForeignKey("role_id")]
        public int role_id { get; set; }
    }
}