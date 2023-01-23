using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    [Table("employee")]
    public partial class Employee
    {
        public int ID { get; set; }
        public string name { get; set; }
        public string email_address { get; set; }
        public string task_name { get; set; }
        public string start { get; set; }
        public string finish { get; set; }
    }
}