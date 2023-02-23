using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeSkills
    {
        [Key]
        public int ID { get; set; }
        public string EmailID { get; set; }
        public int SkillID { get; set; }
    }
}