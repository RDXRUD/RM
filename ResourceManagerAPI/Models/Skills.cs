using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class Skills
    {
        [Key]
        public int SkillID { get; set; }
        public string? Skill { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }


    }
    public class NewSkills
    {
        [Key]
        public int SkillID { get; set; }
        public string? Skill { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }


    }
}