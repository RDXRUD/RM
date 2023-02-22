
namespace ResourceManagerAPI.Models
{
    public class FilterViewModel
    {
        public string? Name { get; set; }
        public string? EmailID { get; set; }
        public string? TaskName { get; set; }
        public DateTime? AssignedFrom { get; set; }
        public DateTime? AssignedTo { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public string? Skill { get; set; }
 
    }

}
