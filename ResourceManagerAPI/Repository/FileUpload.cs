using java.util;
using net.sf.mpxj;
using net.sf.mpxj.mpp;
using Npgsql;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using Assignment = net.sf.mpxj.ResourceAssignment;
using File = ResourceManagerAPI.Models.File;
using Path = System.IO.Path;
using Task = net.sf.mpxj.Task;

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
        public void GetData(File getfileinfo)
        {
            NpgsqlConnection con = new NpgsqlConnection(this.Configuration.GetSection("ConnectionStrings")["Ef_Postgres_Db"]);
            MPPReader reader = new MPPReader();

            string fileName = $"{DateTime.Now.ToString("yyyyMMMdd")}_{Path.GetRandomFileName()}";
            string fileExtension = Path.GetExtension(getfileinfo.file.FileName);
            string filePath = Path.Combine("FileHolder", fileName + fileExtension);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                getfileinfo.file.CopyTo(stream);
            }
            ProjectFile projectObj = reader.read(filePath);
            string FileNameDB = fileName + fileExtension;
            AddUploadRecordToDb(getfileinfo, FileNameDB, con);

            using (var cmdd = new NpgsqlCommand("delete from employees", con))
            {
                con.Open();

                cmdd.ExecuteNonQuery();
                con.Close();
            }
            using (var cmdd = new NpgsqlCommand("delete from employeetasks", con))
            {
                con.Open();

                cmdd.ExecuteNonQuery();
                con.Close();
            }

            List<ProjectData> tempResourceList = new List<ProjectData>();
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
                                AddEmployeeToDb(projectData, con);
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
                                AddEmployeeToDb(projectData, con);
                            }
                            else
                            {
                                empId = tempResourceList.Find(x => x.Name == resourceName).Id;
                            }
                        }
                        using (var cmd = new NpgsqlCommand("insert into employeetasks(\"EmpID\", \"TaskName\", \"Start\", \"Finish\")Values(" + (empId != 0 ? empId : "null") + ", " + (!string.IsNullOrEmpty(taskName) ? ("'" + taskName + "'") : "null") + ", " + (start is not null ? ("'" + start + "'") : "null") + ", " + (finish is not null ? ("'" + finish + "'") : "null") + " ) ", con))
                        {
                            con.Open();

                            cmd.ExecuteNonQuery();
                            con.Close();
                        }
                    }
                }
            }
        }
        private static void AddEmployeeToDb(ProjectData projectData, NpgsqlConnection con)
        {
            using (var cmd = new NpgsqlCommand("insert into employees(\"EmpID\",\"ResourceName\", \"EmailID\")Values(" + (projectData.Id != 0 ? ("" + projectData.Id + "") : "null") + ", " + (projectData.Name != "" ? ("'" + projectData.Name + "'") : "null") + ", " + (projectData.Email != "" ? ("'" + projectData.Email + "'") : "null") + " ) ", con))
            {
                con.Open();

                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
        public void AddUploadRecordToDb(File getfileinfo,string FileNameDB, NpgsqlConnection con)
        {
            using (var cmd = new NpgsqlCommand("insert into uploadrecord(\"UserName\",\"FileName\")Values(" + (getfileinfo.UserName != "" ? ("'" + getfileinfo.UserName + "'") : "null") + ", " + (FileNameDB != "" ? ("'" + FileNameDB + "'") : "null") + " ) ", con))
            {
                con.Open();

                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
        private static EnumerableCollection ToEnumerable(Collection javaCollection)
        {
            return new EnumerableCollection(javaCollection);
        }
    }
}
