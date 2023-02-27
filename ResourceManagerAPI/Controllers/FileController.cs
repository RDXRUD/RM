using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.Models;
using Microsoft.AspNetCore.Http;
using ResourceManagerAPI.IRepository;
using File = ResourceManagerAPI.Models.File;

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
        [Route("LoadFileData")]
        public IActionResult GetData([FromForm] File fileinfo)
        {
            _fileupload.GetData(fileinfo);
            return Ok();
        }
    }
}
