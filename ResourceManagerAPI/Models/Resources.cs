using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class Resources
    {
        [Key]
        public int ResourceID { get; set; }
        public int EmpID { get; set; }
        public string? EmailID { get; set; }
    }
}