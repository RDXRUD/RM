using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeTasks
    {
        [Key]
        public int EmployeeTaskID { get; set; }
        [ForeignKey("EmpID")]
        public int EmpID { get; set; }
        public string? TaskName { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
    }
}