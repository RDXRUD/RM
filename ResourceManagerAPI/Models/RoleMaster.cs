using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

 

namespace ResourceManagerAPI.Models
{
    public class RoleMaster
    {
        [Key]
        public int role_id { get; set; }
        public string role_name { get; set; }
        public string role_description { get; set; }
    }
}