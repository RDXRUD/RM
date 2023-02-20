using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data.SqlClient;
using System.Data;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Repository;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IAccount _account;
        public UserController(IAccount account)
        {
            _account = account;
        }


        [HttpPost]
        [Route("AddUser")]
        public IActionResult AddUser(string username, string password)
        {
            return Ok(_account.AddUser(username, password));
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public IActionResult DeleteUser(string username, string password)
        {
            return Ok(_account.DeleteUser(username, password));
        }


            [NonAction]
        private List<Users> GetUsers()
        {
            List<Users> users = new List<Users>();

            string constr = "Server=localhost;Database=postgres;Port=5432;User Id=postgres;Password=748096";

            using (NpgsqlConnection con = new NpgsqlConnection(constr))
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand("SELECT UserName, Password FROM users"))
                {
                    cmd.Connection = con;
                    con.Open();
                    using (NpgsqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            users.Add(new Users
                            {
                                UserName = sdr["UserName"].ToString(),
                                Password = sdr["Password"].ToString(),
                                //DecryptedPassword = Decrypt(sdr["Password"].ToString())
                            });
                        }
                    }
                    con.Close();
                }
            }
            return users;
        }

        [NonAction]
        private List<Users> GetUser()
        {
            List<Users> users = new List<Users>();

            string constr = "Server=localhost;Database=postgres;Port=5432;User Id=postgres;Password=748096";

            using (NpgsqlConnection con = new NpgsqlConnection(constr))
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand("SELECT UserName, Password FROM users"))
                {
                    cmd.Connection = con;
                    con.Open();
                    using (NpgsqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            users.Remove(new Users
                            {
                                UserName = sdr["UserName"].ToString(),
                                Password = sdr["Password"].ToString(),
                                //DecryptedPassword = Decrypt(sdr["Password"].ToString())
                            });
                        }
                    }
                    con.Close();
                }
            }
            return users;
        }





        //[HttpPost, Route("[action]", Name = "Login")]
        //public Result Login(Users users)
        //{
        //    Users userdetails = new Users();
        //    Result result = new Result();
        //    try
        //    {
        //        if (users != null && !string.IsNullOrWhiteSpace(users.UserName) && !string.IsNullOrWhiteSpace(users.Password))
        //        {
        //            var conn = new NpgsqlConnection(_configuration["ConnectionStrings:Ef_Postgres_Db"]);
        //            using (conn)
        //            {
        //                NpgsqlCommand cmd = new NpgsqlCommand("sp_users", conn);
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.AddWithValue("@username", users.UserName);
        //                cmd.Parameters.AddWithValue("@password", users.Password);
        //                cmd.Parameters.AddWithValue("@stmttype", "userlogin");
        //                NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(cmd);
        //                DataTable dt = new DataTable();
        //                adapter.Fill(dt);

        //                if (dt != null && dt.Rows.Count > 0)
        //                {
        //                    userdetails.UserName = dt.Rows[0]["username"].ToString();
        //                    userdetails.Password = dt.Rows[0]["password"].ToString();
        //                    //userdetails.TaskName = dt.Rows[0]["taskname"].ToString();


        //                    result.result = true;
        //                    result.message = "success";
        //                }
        //                else
        //                {
        //                    result.result = false;
        //                    result.message = "Invalid user";
        //                }
        //            }
        //        }
        //        else
        //        {
        //            result.result = false;
        //            result.message = "Please enter username and password";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        result.result = false;
        //        result.message = "Error occurred: " + ex.Message.ToString();
        //    }
        //    return result;
        //}
    }
}