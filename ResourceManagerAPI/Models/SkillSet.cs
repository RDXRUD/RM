using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class SkillSet
    {
        [Key]
        public int ID { get; set; }
        public int SkillGroupID { get; set; }
        public string? Skill { get; set; }
    }
}