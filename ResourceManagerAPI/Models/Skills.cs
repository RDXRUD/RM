using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class Skills
    {
        [Key]
        public int ID { get; set; }
        public int ResourceID { get; set; }
        public string SkillGroup { get; set; }
        public string Skill { get; set; }
        public int SkillID { get; set; }
    }
}