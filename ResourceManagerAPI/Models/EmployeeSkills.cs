using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeSkills
    {
        [Key]
        public int ResourceID { get; set; }
        public string? EmailID { get; set; }
    }
}