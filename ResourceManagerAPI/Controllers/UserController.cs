using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using ResourceManagerAPI.IRepository;

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

    }
}