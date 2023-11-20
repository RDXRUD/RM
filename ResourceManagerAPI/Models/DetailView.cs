
namespace ResourceManagerAPI.Models
{
    public class DetailView
    {
        public string? res_name { get; set; }
        public string? res_email_id { get; set; }
        public string project_name { get; set; }
        public IEnumerable<string?> project_managers { get; set; }
        public string client_name { get; set; }
        public string skill { get; set; }
        public string skillGroup { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
    }
}
