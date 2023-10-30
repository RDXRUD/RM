using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class ResourceLocation

    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public string res_user_id { get; set; }
        public string status { get; set; } = "ACTIVE"; // Default value is "Active"\
        public DateTime res_create_date { get; set; }= DateTime.Now;
        public DateTime res_last_modified { get; set; }
        public int? sso_flag { get; set; }
        public string location { get; set; }
        public string password { get; set;}
        public string role_name { get; set; }
    }
}
