using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class SharePointUploadRecord
    {
        [Key]
        public int SkillsRecordId{ get; set; }
        public int UserId { get; set; }
        public string? FileName { get; set; }
    }
}
