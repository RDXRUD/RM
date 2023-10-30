using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class SkillGroups
    {
        [Key]
        public int SkillGroupID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
    }
    public class NewSkillGroup
    {
        [Key]
        public int SkillGroupID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
    }
}