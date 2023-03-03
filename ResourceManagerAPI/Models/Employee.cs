using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class Employee
    {
        [Key]
        public int EmpID { get; set; }
        public string? ResourceName { get; set; }
        public string? EmailID { get; set; }
    }
}