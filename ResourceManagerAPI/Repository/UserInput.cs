using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Text;
using File = ResourceManagerAPI.Models.File;
using Resources = ResourceManagerAPI.Models.Resources;
using Skills = ResourceManagerAPI.Models.Skills;
using System.Diagnostics;


namespace ResourceManagerAPI.Repository
{
    public class UserInput : IUserInput
    {
        private readonly IConfiguration Configuration;
        private readonly PGDBContext _dbContext;
        int id = 0;
        int skillID = 1;

        public UserInput(IConfiguration configuration, PGDBContext context)
        {
            Configuration = configuration;
            _dbContext = context;
        }
        List<SkillGroups> skillGroupList = new List<SkillGroups>();
        List<Resources> EmailData = new List<Resources>();
        List<Resources> LocationData = new List<Resources>();


        public void GetSkillData([FromForm] Dictionary<string, string> InputData, [FromForm] File planFileInfo)
        {
            var skillSet = from s in _dbContext.skillset
                           select new SkillSet
                           {
                               SkillGroupID = s.SkillGroupID,
                               SkillSetID = s.SkillSetID,
                               SkillID = s.SkillID
                           };
            _dbContext.resources.RemoveRange(_dbContext.resources);
            _dbContext.skillgroup.RemoveRange(_dbContext.skillgroup);
            _dbContext.skill.RemoveRange(_dbContext.skill);
            _dbContext.skillset.RemoveRange(_dbContext.skillset);
            _dbContext.resourceskills.RemoveRange(_dbContext.resourceskills);
            _dbContext.SaveChanges();

            List<string> emailData = new List<string>();
            List<JsonSkill> columnList = new List<JsonSkill>();
            List<Dictionary<string, string>> rowDataList = new List<Dictionary<string, string>>();
            Dictionary<string, List<string>> excelDataDictionary = new Dictionary<string, List<string>>();


            string fileName = $"{DateTime.Now.ToString("yyyyMMMdd")}_{Path.GetRandomFileName()}";
            string fileExtension = Path.GetExtension(planFileInfo.PlanFile.FileName);
            string filePath = Path.Combine("FileHolder", fileName + fileExtension);

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            var encodingProvider = CodePagesEncodingProvider.Instance;
            Encoding.RegisterProvider(encodingProvider);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                planFileInfo.PlanFile.CopyTo(stream);
            }

            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    if (reader.Read())
                    {
                        for (int columnIndex = 0; columnIndex < reader.FieldCount; columnIndex++)
                        {
                            object columnValue = reader.GetValue(columnIndex);
                            JsonSkill columnStringValue = new JsonSkill { ColumnLists = columnValue.ToString().Replace(((char)0x00A0).ToString(), " ") };
                            columnList.Add(columnStringValue);
                            excelDataDictionary[columnValue.ToString().Replace(((char)0x00A0).ToString(), " ")] = new List<string>();
                        }
                    }

                    while (reader.Read())
                    {
                        Dictionary<string, string> rowData = new Dictionary<string, string>();

                        for (int columnIndex = 0; columnIndex < reader.FieldCount; columnIndex++)
                        {
                            object columnValue = reader.GetValue(columnIndex);
                            string columnName = columnList[columnIndex].ColumnLists;
                            string columnStringValue = (columnValue is null ? "" : columnValue.ToString().Replace(((char)0x00A0).ToString(), " "));
                            excelDataDictionary[columnName].Add(columnStringValue);
                            rowData[columnName] = columnStringValue;
                        }

                        rowDataList.Add(rowData);
                    }

                }

                int skillGroupID = 1;

                foreach (var kvp in InputData)
                {
                    string key = kvp.Key.Replace(((char)0x00A0).ToString(), " "); ;
                    string value = kvp.Value;

                    if (value == "not imported")
                    {
                        continue;
                    }
                    else if (value == "Email")
                    {
                        GetEmailData(key, columnList, excelDataDictionary);

                        GetResourceSkills(rowDataList);
                    }
                    else if (value == "Location")
                    {
                        GetLocationData(key, columnList, excelDataDictionary);
                        //GetResourceSkills(rowDataList);
                    }

                    else if (value == "skill Group")
                    {
                        var skillgroup = new SkillGroups()
                        {
                            SkillGroupID = skillGroupID,
                            SkillGroup = key,
                        };
                        skillGroupList.Add(skillgroup);
                        _dbContext.skillgroup.Add(skillgroup);
                        _dbContext.SaveChanges();
                        skillGroupID++;

                        GetSkillData(key, excelDataDictionary);

                        GetSkillSetData(key, excelDataDictionary);
                    }
                }
            }
        }
        private void GetSkillData(string key, Dictionary<string, List<string>> excelDataDictionary)
        {
            List<Skills> skillData = new List<Skills>();

            if (excelDataDictionary.ContainsKey(key))
            {
                List<string> columnData = excelDataDictionary[key]
                    .SelectMany(x => x.Replace(";#", ";").Split(';'))
                    .Where(x => !string.IsNullOrEmpty(x))
                    .Distinct()
                    .ToList();

                if (_dbContext.skill != null)
                {
                    columnData = columnData.Where(x => !_dbContext.skill.Select(y => y.Skill).Contains(x)).ToList();
                }

                if (columnData.Count > 0)
                {
                    skillData.AddRange(columnData.Select((x, index) => new Skills { Skill = x, SkillID = skillID + index }));
                    skillID += columnData.Count;

                    _dbContext.skill.AddRange(skillData);
                    _dbContext.SaveChanges();
                }
            }

        }

        private void GetSkillSetData(string key, Dictionary<string, List<string>> excelDataDictionary)
        {
            if (excelDataDictionary.ContainsKey(key))
            {
                List<string> columnDatas = excelDataDictionary[key];
                List<string> skillSetData = columnDatas
                    .SelectMany(value => value.Replace(";#", ";").Split(';'))
                    .Where(x => !string.IsNullOrEmpty(x))
                    .Distinct()
                    .ToList();

                var skillGroup = skillGroupList.FirstOrDefault(g => g.SkillGroup == key);
                if (skillGroup == null)
                    return;

                var existingSkills = _dbContext.skill
                    .Where(s => skillSetData.Contains(s.Skill))
                    .ToDictionary(s => s.Skill, s => s.SkillID);

                var skillSetsToAdd = new List<SkillSet>();
                foreach (string skillsetTemp in skillSetData)
                {
                    if (existingSkills.TryGetValue(skillsetTemp, out int skillId))
                    {
                        id++;
                        var addSkillSet = new SkillSet()
                        {
                            SkillSetID = id,
                            SkillGroupID = skillGroup.SkillGroupID,
                            SkillID = skillId
                        };
                        skillSetsToAdd.Add(addSkillSet);
                    }
                }

                if (skillSetsToAdd.Count > 0)
                {
                    _dbContext.skillset.AddRange(skillSetsToAdd);
                    _dbContext.SaveChanges();
                }
            }

        }


        private void GetEmailData(string key, List<JsonSkill> columnList, Dictionary<string, List<string>> excelDataDictionary)
        {
            int resID = 1;
            List<Resources> resourcesToAdd = new List<Resources>();
           
            if (excelDataDictionary.ContainsKey(key))
            {
                {
                    List<string> columnData = excelDataDictionary[key];
                    foreach (var email in columnData)
                    {
                        Resources tempRes = new Resources
                        {

                            ResourceID = resID,
                            EmailID = email,
                        };
                        Debug.WriteLine(email);
                        Console.WriteLine(email);
                        Console.WriteLine($"Resource{email}");

                        EmailData.Add(tempRes);
                        resourcesToAdd.Add(tempRes);
                        resID++;
                    }
                }
            }

            _dbContext.resources.AddRange(resourcesToAdd);
            _dbContext.SaveChanges();
        }

        private void GetLocationData(string key, List<JsonSkill> columnList, Dictionary<string, List<string>> excelDataDictionary)
        {
            int resID = 1;
            List<Resources> resourcesToUpdate = new List<Resources>();
            //Resources resource = new Resources();
            Employee employee = new Employee(); 
            if (excelDataDictionary.ContainsKey(key))
            {
                List<string> columnData = excelDataDictionary[key];
                foreach (var location in columnData)
                {
                    
                    //var res = _dbContext.resources.FirstOrDefault(r => r.ResourceID == resID);
                    //if (res != null)
                    //{
                        var existingResource = _dbContext.employees.FirstOrDefault(r => r.EmpID == resID);
                        if (existingResource != null)
                        {
                        Debug.WriteLine(location);
                        employee.Location = location;
                        
                    }
                        
                    //}
                    else
                    {
                        // Add debug output or log here to check if a resource is not found.
                        Console.WriteLine($"Resource with ResourceID {resID} not found.");
                    }
                    resID++;
                }
            }
            _dbContext.SaveChanges();
            //if (resourcesToUpdate.Count > 0)
            //{
            //    //_dbContext.resources.UpdateRange(resourcesToUpdate);
                
            //}
        }




        //private void GetLocationData(string key, List<JsonSkill> columnList, Dictionary<string, List<string>> excelDataDictionary)
        //{

        //    int resID = 1;
        //    List<Resources> resourcesToAdd = new List<Resources>();

        //    if (excelDataDictionary.ContainsKey(key))
        //    {
        //        {
        //            //var db = _dbContext.resources.Where(r => r.ResourceID == 2).FirstOrDefault();
        //            List<string> columnData = excelDataDictionary[key];
        //            foreach (var location in columnData)
        //            {
        //                var db = _dbContext.resources.Where(r => r.ResourceID == resID).FirstOrDefault();
        //                db.Location = location;
        //                //Resources tempRes = new Resources
        //                //{
        //                //    //ResourceID = resID,
        //                //    Location = location
        //                //};
        //                //LocationData.Add(tempRes);
        //                //resourcesToAdd.Add(tempRes);
        //                resID++;
        //                //db.SaveChanges();
        //            }

        //        }
        //    }

        //    //if (resourcesToAdd != null && resourcesToAdd.Any())
        //    //{
        //    //_dbContext.resources.Update(LocationData);
        //    //_dbContext.resources.UpdateRange(resourcesToAdd);
        //    _dbContext.SaveChanges();
        //    //}
        //}

        private void GetResourceSkills(List<Dictionary<string, string>> rowDataList)
        {
            var skills = (from s in _dbContext.skill
                          select new Skills
                          {
                              SkillID = s.SkillID,
                              Skill = s.Skill,
                          }).ToList();

            var skillSet = (from s in _dbContext.skillset
                            select new SkillSet
                            {
                                SkillSetID = s.SkillSetID,
                                SkillGroupID = s.SkillGroupID,
                                SkillID = s.SkillID
                            }).ToList();


            int matchingResourceIds = 0;
            List<int> matchedSkillSetIds = new List<int>();
            List<ResourceSkills> skillResources = new List<ResourceSkills>();


            foreach (var rowData in rowDataList)
            {
                matchedSkillSetIds = new List<int>();
                matchingResourceIds = 0;
                var data = string.Empty;
                int skillgroupid = 0;
                foreach (var item in rowData)
                {
                    skillgroupid = skillGroupList.Where(x => x.SkillGroup == item.Key).Select(x => x.SkillGroupID).FirstOrDefault();

                    var datas = item.Value.Replace(";#", ";").Split(';').Where(x => !string.IsNullOrEmpty(x)).ToList();

                    if (datas.Count > 0)
                    {
                        var result = (from sg in skillSet
                                      join s in skills.Where(X => datas.Contains(X.Skill)) on sg.SkillID equals s.SkillID
                                      where sg.SkillGroupID == skillgroupid
                                      select new ResourceSkills { SkillSetID = sg.SkillSetID }).ToList();

                        skillResources.AddRange(result);

                        if (EmailData.Any(r => datas.Contains(r.EmailID)))
                        {
                            matchingResourceIds = (EmailData.Where(r => datas.Contains(r.EmailID)).Select(x => x.ResourceID).FirstOrDefault());
                            skillResources.Where(x => x.ResourceID == 0).ToList().ForEach(x => x.ResourceID = matchingResourceIds);
                        }
                    }
                }
            }
            if (skillResources != null)
            {
                _dbContext.resourceskills.AddRange(skillResources);
                _dbContext.SaveChanges();
            }
        }
    }
    public class JsonSkill
    {
        public string? ColumnLists { get; set; }
    }
}