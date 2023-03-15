using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class PlanUploadRecord
    {
        [Key]
        public int UserID { get; set; }
        public string? UserName { get; set; }
        public string? FileName { get; set; }
    }
}
