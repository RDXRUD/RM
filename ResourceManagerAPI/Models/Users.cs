using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class Users
    {
        [Key]
        public int UserID { get; set; }
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string Password { get; set; }
    }
}