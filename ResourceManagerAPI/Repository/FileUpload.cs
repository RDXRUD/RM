using java.util;
using net.sf.mpxj;
using net.sf.mpxj.mpp;
using Npgsql;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using Assignment = net.sf.mpxj.ResourceAssignment;
using Path = System.IO.Path;
using Task = net.sf.mpxj.Task;
using File = ResourceManagerAPI.Models.File;
using System.IO;
using ResourceManagerAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity;
using net.sf.mpxj.MpxjUtilities;
using com.sun.tools.javadoc;
using com.sun.xml.@internal.bind.v2.runtime.unmarshaller;
using static com.sun.xml.@internal.xsom.impl.WildcardImpl;
using java.lang;
using ResourceManagerAPI.Controllers;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;

namespace ResourceManagerAPI.Repository
{
    public class FileUpload : IFileUpload
    {
        private readonly PGDBContext _dbContext;
        private IConfiguration Configuration;
		public FileUpload(PGDBContext connection, IConfiguration configuration)
        {
            _dbContext = connection;
            Configuration = configuration;
        }
        public void GetData(File PlanFileInfo)
        {
            NpgsqlConnection con = new NpgsqlConnection(this.Configuration.GetSection("ConnectionStrings")["Ef_Postgres_Db"]);
            MPPReader reader = new MPPReader();
            string fileName = $"{DateTime.Now.ToString("yyyyMMMdd")}_{Path.GetRandomFileName()}";
            string fileExtension = Path.GetExtension(PlanFileInfo.PlanFile.FileName);
            string filePath = Path.Combine("FileHolder", fileName + fileExtension);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                PlanFileInfo.PlanFile.CopyTo(stream);
            }
            ProjectFile projectObj = reader.read(filePath);
            string FileNameDB = fileName + fileExtension;
           
            AddUploadRecordToDb(UserController.userId, FileNameDB);

            _dbContext.employees.RemoveRange(_dbContext.employees); //Deletion Of Old DB Data Before Loading The New One
            _dbContext.employeetasks.RemoveRange(_dbContext.employeetasks);
            //_dbContext.Database.ExecuteSqlRaw("update resources set EmpID = null");
            _dbContext.SaveChanges();

            List < ProjectData > tempResourceList = new List<ProjectData>();
            var id = 0;
            foreach (Task task in ToEnumerable(projectObj.getTasks()))
            {
                var taskName = task.getName();
                foreach (Assignment assignment in ToEnumerable(task.getResourceAssignments()))
                {
                    var resource = assignment.getResource();
                    if (resource is not null)
                    {
                        var start = assignment.getStart();
                        var finish = assignment.getFinish();
                        var resourceName = resource.getName();
                        var resourceEmail = resource.getEmailAddress();
                        var empId = 0;
                        if (!string.IsNullOrEmpty(resourceEmail))
                        {
                            if (!tempResourceList.Any(x => x.Email == resourceEmail))
                            {
                                id++;
                                empId = id;
                                ProjectData projectData = new ProjectData { Id = empId, Name = resourceName, Email = resourceEmail };
                                tempResourceList.Add(projectData);
                                AddEmployeeToDb(projectData);
                            }
                            else
                            {
                                empId = tempResourceList.Find(x => x.Email == resourceEmail).Id;
                            }
                        }
                        else
                        {
                            if (!tempResourceList.Any(x => x.Name == resourceName))
                            {
                                id++;
                                empId = id;
                                ProjectData projectData = new ProjectData { Id = empId, Name = resourceName, Email = resourceEmail };
                                tempResourceList.Add(projectData);
                                AddEmployeeToDb(projectData);
                            }
                            else
                            {
                                empId = tempResourceList.Find(x => x.Name == resourceName).Id;
                            }
                        }
                        AddEmployeeTasksToDb(empId, taskName, start.ToDateTime(), finish.ToDateTime());
                    }
                }
            }
        }
        private void AddEmployeeToDb(ProjectData projectData)
        {
            var Emp = new Employee()
            {
                EmpID = projectData.Id,
                ResourceName = projectData.Name!="" ? projectData.Name:"null",
                EmailID = projectData.Email!="" ? projectData.Email:"null"
            };
            _dbContext.employees.Add(Emp);
            _dbContext.SaveChanges();

            var resource = _dbContext.resources.FirstOrDefault(r => r.EmailID == projectData.Email);
            
            if (resource == null)
            {
                int resID;
                int? intIdt = _dbContext.resources.Max(r => (int?)r.ResourceID);
                resID = (intIdt is null) ? 1 : (int)intIdt;

                var res = new Resources
                {
                    ResourceID = resID,
                    EmailID = projectData.Email,
                    EmpID = projectData.Id
                };
                _dbContext.resources.Add(res);
                _dbContext.SaveChanges();
            }
            else
            {
                resource.EmpID = projectData.Id;
                _dbContext.SaveChanges();
            }
        }
        private void AddEmployeeTasksToDb(int empId, string taskName, DateTime start, DateTime finish)
        {
            var EmpTask = new EmployeeTasks()
            {
                EmpID = empId,
                TaskName = taskName,
                Start = start,
                Finish = finish
            };
            _dbContext.employeetasks.Add(EmpTask);
            _dbContext.SaveChanges();
        }
        private void AddUploadRecordToDb(int UserId,string FileNameDB)
        {
            var Upload = new PlanUploadRecord()
            {
                UserId = UserId,
                FileName= FileNameDB
            };
            _dbContext.uploadrecord.Add(Upload);
            _dbContext.SaveChanges();
        }
        private void AddEmpIDToResourcesTable(int tempEmpID)
        {
            var Emp = new Resources()
            {
                EmpID = tempEmpID
            };
            _dbContext.resources.Add(Emp);
            _dbContext.SaveChanges();
        }
        private static EnumerableCollection ToEnumerable(Collection javaCollection)
        {
            return new EnumerableCollection(javaCollection);
        }
    }
}
