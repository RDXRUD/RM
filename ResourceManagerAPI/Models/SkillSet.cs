using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class SkillSet
    {
        public int ID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Skill { get; set; }
    }
}