using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using ResourceManagerAPI.IRepository;
using Microsoft.AspNetCore.Authorization;
using ResourceManagerAPI.Models;
using ResourceManagerAPI.DBContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IAccount _account;
        public IConfiguration _configuration;
        private readonly PGDBContext _dbContext;
        public UserController(IAccount account, IConfiguration config, PGDBContext context)
        {
            _account = account;
            _configuration = config;
            _dbContext = context;
        }
        [HttpPost, Authorize]
        [Route("AddUser")]
        public IActionResult AddUser(Users user)
        {
            return Ok(_account.AddUser(user));
        }
        [HttpDelete, Authorize]
        [Route("DeleteUser")]
        public IActionResult DeleteUser(Users user)
        {
            return Ok(_account.DeleteUser(user));
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Post(Users _userData)
        {
            if (_userData != null && _userData.UserID!=null && _userData.UserName != null && _userData.FullName != null)
            {
                var user = await GetUser(_userData.UserID, _userData.UserName, _userData.FullName);

                if (user != null)
                {
                    //create claims details based on the user information
                    var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserID",user.UserID.ToString()),
                        new Claim("UserName", user.UserName.ToString()),
                        new Claim("FullName", user.FullName.ToString())
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(10),
                        signingCredentials: signIn);

                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
                else
                {
                    return BadRequest("Invalid Credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }
        private async Task<Users> GetUser(int userid ,string username,string fullname)
        {
            return await _dbContext.users.FirstOrDefaultAsync(u => u.UserID == userid && u.UserName == username && u.FullName == fullname);
        }
    }
}