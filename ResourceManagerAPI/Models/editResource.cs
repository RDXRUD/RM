using System.ComponentModel.DataAnnotations.Schema;

 

namespace ResourceManagerAPI.Models
{
    public class EditResource
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public string res_user_id { get; set; }
        public int? sso_flag { get; set; }
        public string location { get; set; }
        public string role_name { get; set; }
    }
}
