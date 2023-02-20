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
        [Route("GetFilIFileUpload")]
        public IActionResult GetData(IFormFile file, string UserName)
        {
            _fileupload.GetData(file, UserName);
            return Ok();
        }

        //[HttpPost, Route("GetFilesData")]
        //public async Task<IActionResult> OnPostUploadAsync(List<IFormFile> files)
        //{
        //    long size = files.Sum(f => f.Length);

        //    foreach (var formFile in files)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            var filePath = Path.GetTempFileName();

        //            using (var stream = System.IO.File.Create(filePath))
        //            {
        //                await formFile.CopyToAsync(stream);
        //            }
        //        }
        //    }

        //    return Ok(new { count = files.Count, size });
        //}

    }
}
