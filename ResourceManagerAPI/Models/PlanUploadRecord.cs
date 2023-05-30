using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class PlanUploadRecord
    {
        [Key]
        public int UploadRecordId { get; set; }
        public int UserId { get; set; }
        public string? FileName { get; set; }
    }
}
