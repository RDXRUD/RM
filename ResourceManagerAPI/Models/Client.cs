using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class Client
    {
        [Key]
        public int client_id { get; set; }
        public string client_name { get; set; }
        public string partner_incharge { get; set; }
        public string? status { get; set; }

    }
}
