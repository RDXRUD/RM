using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class Skills
    {
        [Key]
        public int SkillID { get; set; }
        public string? Skill { get; set; }
    }
}
