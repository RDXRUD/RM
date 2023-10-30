using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public class ResourceMaster
    {
        [Key]
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public string res_user_id { get; set; }
        [ForeignKey("location_id")]
        public int location_id { get; set; }
        public string status { get; set; } = "ACTIVE"; // Default value is "Active"\
        public DateTime res_create_date { get; set; }= DateTime.UtcNow.Date;
        public DateTime res_last_modified { get; set; }
        public string? password { get; set; }
        public int? sso_flag { get; set; }    

    }
}
