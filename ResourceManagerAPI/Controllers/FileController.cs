using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.Models;
using Microsoft.AspNetCore.Http;
using ResourceManagerAPI.IRepository;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : Controller
    {
        private readonly IFileUpload _fileupload;
        public FileController(IFileUpload fileupload)
        {
            _fileupload = fileupload;
        }

        [HttpPost]
        [Route("GetFilIFileUpload")]
        public IActionResult GetData(IFormFile file, string UserName)
        {
            _fileupload.GetData(file, UserName);
            return Ok();
        }

    }
}
