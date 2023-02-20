using ResourceManagerAPI.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using File = ResourceManagerAPI.Models.File;

namespace ResourceManagerAPI.IRepository
{
    public interface IFileUpload
    {
        void GetData(IFormFile file, string UserName);
    }
}
