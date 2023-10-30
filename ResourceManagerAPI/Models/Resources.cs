using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class Resources
    {
        [Key]
        public int ResourceID { get; set; }    
        public string? EmailID { get; set; }

    }
}