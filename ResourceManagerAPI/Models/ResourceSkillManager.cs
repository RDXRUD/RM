using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class ResourceSkillManager
    {
        public int ResourceID { get; set; }
        public int SkillGroupID { get; set; }
        public int SkillID { get; set; }
        public string? EmailID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Skill { get; set; }
    }
}