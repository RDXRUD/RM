
namespace ResourceManagerAPI.Models
{
    public class FilterViewModel
    {
        public int[]? res_name { get; set; }
        public int? location { get; set; }
        public int? skillSetID { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }

    }
}
