using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class Login
    {
        [Key]
        public string UserID { get; set; }
        public string Password { get; set; }
    }
}
