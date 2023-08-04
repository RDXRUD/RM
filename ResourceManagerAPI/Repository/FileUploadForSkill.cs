using System.Data;
using ExcelDataReader;
using ResourceManagerAPI.Models;
using System.Text;
using File = ResourceManagerAPI.Models.File;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.Controllers;
namespace ResourceManagerAPI.Repository
{
    public class FileUploadForSkill : IFileUploadForSkills
    {

        private readonly IConfiguration Configuration;
        private readonly PGDBContext _dbContext;
        public FileUploadForSkill(IConfiguration configuration, PGDBContext context)
        {
            Configuration = configuration;
            _dbContext = context;
        }

        public List<JsonSkill> GetExcelData(File planFileInfo)
        {

            List<JsonSkill> columnList = new List<JsonSkill>();
            //Dictionary<string, List<string>> excelDataDictionary = new Dictionary<string, List<string>>();

            string fileName = $"{DateTime.Now.ToString("yyyyMMMdd")}_{Path.GetRandomFileName()}";
            string fileExtension = Path.GetExtension(planFileInfo.PlanFile.FileName);
            string filePath = Path.Combine("FileHolder", fileName + fileExtension);

            AddUploadRecordToDb(UserController.userId, filePath);

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            var encodingProvider = CodePagesEncodingProvider.Instance;
            Encoding.RegisterProvider(encodingProvider);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                planFileInfo.PlanFile.CopyTo(stream);
            }
            _dbContext.columnlistrecord.RemoveRange(_dbContext.columnlistrecord);
            _dbContext.SaveChanges();
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    if (reader.Read())
                    {
                        for (int columnIndex = 0; columnIndex < reader.FieldCount; columnIndex++)
                        {
                            object columnValue = reader.GetValue(columnIndex);
                            JsonSkill columnStringValue = new JsonSkill { ColumnLists = columnValue.ToString() };
                            var skillList = new ColumnLists()
                            {
                                ColumnList = columnValue.ToString()
                            };
                            _dbContext.columnlistrecord.Add(skillList);
                            _dbContext.SaveChanges();
                            columnList.Add(columnStringValue);

                        }
                    }

                }
            }
            return columnList;
        }
        private void AddUploadRecordToDb(int UserId, string filePath)
        {
            var UploadFile = new SharePointUploadRecord()
            {
                UserId = UserId,
                FileName = filePath
            };
            _dbContext.skillsuploadrecord.Add(UploadFile);
            _dbContext.SaveChanges();
        }

        public class JsonSkill
        {
            public string ColumnLists { get; set; }
        }
    }
}