
namespace ResourceManagerAPI.IRepository
{
    public interface IFileUpload
    {
        void GetData(IFormFile file, string UserName);
    }
}
