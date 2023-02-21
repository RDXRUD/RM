using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class Skills
    {
        [Key]
        public int ID { get; set; }
        public int SkillID { get; set; }
        public string SkillGroup { get; set; }
        public string Skill { get; set; }

    }
    public partial class EmployeeSkills
    {
        [Key]
        public int ID { get; set; }
        public string EmailID { get; set; }
        public int SkillID { get; set; }

    }
    public partial class SkillManager
    {
        public int ID { get; set; }
        public int SkillID { get; set; }
        public string EmailID { get; set; }
        public string SkillGroup { get; set; }
        public string Skill { get; set; }
        
    }
    public partial class SkillSet
    {
        public int ID { get; set; }
        public string SkillGroup { get; set; }
        public string Skill { get; set; }

    }

}