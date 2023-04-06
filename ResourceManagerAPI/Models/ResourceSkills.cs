using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class ResourceSkills
    {
        [Key]
        public int ResourceSkillID { get; set; }
        public int ResourceID { get; set; }
        public int SkillSetID { get; set; }
    }
}