using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using File = ResourceManagerAPI.Models.File;
using ResourceManagerAPI.IRepository;
using static ResourceManagerAPI.Repository.FileUploadForSkill;
using Newtonsoft.Json;


namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillListController : ControllerBase
    {
        private readonly IFileUploadForSkills _skillfileupload;
        private readonly IUserInput _userinput;

        public SkillListController(IFileUploadForSkills skillfileupload, IUserInput userInput)
        {
            _skillfileupload = skillfileupload;
            _userinput = userInput;
        }

        [HttpPost, Authorize]
        [Route("LoadSkillFileData")]
        public async Task<IEnumerable<JsonSkill>> GetExcelData([FromForm] File PlanFileInfo)
        {
            var fileUploadSkills = _skillfileupload.GetExcelData(PlanFileInfo);

            var convertedSkills = fileUploadSkills.Select(skill => new JsonSkill
            {
                ColumnLists = skill.ColumnLists
            });

            return convertedSkills;
        }
        
        [HttpPost,Authorize]
        [Route("ProcessUserInput")]


        public IActionResult GetSkillData([FromForm] string inputData, [FromForm] File planFileInfo)
        {
            Dictionary<string, string> dictionaryData = JsonConvert.DeserializeObject<Dictionary<string, string>>(inputData);

            _userinput.GetSkillData(dictionaryData, planFileInfo);

            return Ok(new { Message = "Data received successfully." });
        }
    }
}
    
   


