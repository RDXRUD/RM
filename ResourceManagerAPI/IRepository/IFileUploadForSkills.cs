using ResourceManagerAPI.Repository;
using static ResourceManagerAPI.Repository.FileUploadForSkill;
using JsonSkill = ResourceManagerAPI.Repository.FileUploadForSkill.JsonSkill;

namespace ResourceManagerAPI.IRepository
{
    public interface IFileUploadForSkills
    {
        List<JsonSkill> GetExcelData(Models.File planFileInfo);
    }
}
