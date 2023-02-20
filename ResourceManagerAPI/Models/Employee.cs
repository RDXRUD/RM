using Microsoft.CodeAnalysis;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    [Table("employees")]
    public partial class Employee
    {
        [Key]
        public int EmpID { get; set; }
        public string ResourceName { get; set; }
        public string EmailID { get; set; }
    }

    public partial class EmployeeTasks
    {
        [Key]
        public int EmpID { get; set; }
        public string TaskName { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        
    }

    public partial class EmployeeManager
    {
        public int EmpID { get; set; }
        public string EmailID { get; set; }
        public string ResourceName { get; set; }
        public string TaskName { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }

    }

}