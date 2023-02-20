using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace ResourceManagerAPI.Models
{
    public class File
    {
        public int ID { get; set; }

        //[Required(ErrorMessage ="Please Enter File Name")]
        //public string FileName { get; set; }

        [Required(ErrorMessage = "Please Upload The File")]
        public IFormFile Files { get; set; }
    }
}
