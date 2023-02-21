
namespace ResourceManagerAPI.Models
{
    public class FilterViewModel
    {
        public int EmpID { get; set; }
        public string Name { get; set; }
        public string EmailAddress { get; set; }
        public string TaskName { get; set; }
        public DateTime AssignedFrom { get; set; }
        public DateTime AssignedTo { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime AvailableTo { get; set; }
        public string Skill { get; set; }
 
    }

}
