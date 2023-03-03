using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.Models;
using Microsoft.AspNetCore.Http;
using ResourceManagerAPI.IRepository;
using File = ResourceManagerAPI.Models.File;
using Microsoft.AspNetCore.Authorization;

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

        [HttpPost, Authorize]
        [Route("LoadFileData")]
        public IActionResult GetData([FromForm] File PlanFileInfo)
        {
            _fileupload.GetData(PlanFileInfo);
            return Ok();
        }
    }
}
