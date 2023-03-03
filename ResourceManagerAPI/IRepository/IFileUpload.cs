using File = ResourceManagerAPI.Models.File;

namespace ResourceManagerAPI.IRepository
{
    public interface IFileUpload
    {
        void GetData(File PlanFileInfo);
    }
}
