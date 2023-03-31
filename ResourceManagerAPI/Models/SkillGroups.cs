using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class SkillGroups
    {
        [Key]
        public int SkillGroupID { get; set; }
        public string? SkillGroup { get; set; }
    }
}
