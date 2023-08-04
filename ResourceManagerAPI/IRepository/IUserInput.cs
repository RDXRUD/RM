using File = ResourceManagerAPI.Models.File;

namespace ResourceManagerAPI.IRepository
{
    public interface IUserInput
    {
        public void GetSkillData(Dictionary<string, string> inputData, File planFileInfo);
    }
}
