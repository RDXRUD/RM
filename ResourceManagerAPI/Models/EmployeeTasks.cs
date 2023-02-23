using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeTasks
    {
        [Key]
        public int EmpID { get; set; }
        public string TaskName { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
    }
}