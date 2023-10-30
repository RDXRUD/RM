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
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Net;
using sun.security.krb5.@internal.crypto.dk;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;

namespace ResourceManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JwtToken
    {
        public int UserID { get; internal set; }
        public string? UserName { get; internal set; }
        public string[]? Role { get; internal set; }
        //public string? FullName { get; internal set; }
        public string? Token { get; set; }
    }
    public class UserController : Controller
    {
        public static int userId;
        public static string userName;



        private readonly IAccount _account;
        public IConfiguration _configuration;
        private readonly PGDBContext _dbContext;
        public UserController(IAccount account, IConfiguration config, PGDBContext context)
        {
            _account = account;
            _configuration = config;
            _dbContext = context;
        }

		[HttpGet, Authorize]
        [Route("/api/AllUser")]
        public async Task<IEnumerable<Users>> Get()
        {
            try
            {
                return await _dbContext.users.ToListAsync();
            }
            catch (Exception ex)
            {
                return (IEnumerable<Users>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("/api/AddUser")]
        public IActionResult AddUser([FromBody] Users user)
        {
            try
            {
                return Ok(_account.AddUser(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete, Authorize]
        [Route("/api/DeleteUser")]
        public IActionResult DeleteUser([FromBody] Users user)
        {
            try
            {
                return Ok(_account.DeleteUser(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [NonAction]
        [HttpDelete, Authorize]
        [Route("DeleteUser")]
        public async Task<IActionResult> Delete([FromBody] Users userToDelete)
        {
            var id = userToDelete.UserID;
            if (id < 1)
                return BadRequest();
            var user = await _dbContext.users.FindAsync(id);
            if (user == null)
                return NotFound();
            _dbContext.users.Remove(user);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("Login")]
        
        public async Task<IActionResult> Post([FromBody] Login _userData)
        {
            if (_userData != null && _userData.UserID != null && _userData.Password != null)
            {
                var users = await _dbContext.resource_master.ToListAsync();
                var user = users.FirstOrDefault(u => u.res_user_id == _userData.UserID && Decrypt(u.password) == _userData.Password);
                

                if (user != null)
                {
                    var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserName", user.res_user_id),
                       
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddDays(1),
                        signingCredentials: signIn);

                    var userRoles = await (from rr in _dbContext.resource_role
                                           join role in _dbContext.role_master
                                           on rr.role_id equals role.role_id
                                           where rr.resource_id == user.res_id // Assuming UserID corresponds to resource_id
                                           select role.role_name).ToListAsync();

                    userName = user.res_user_id;
                    var jwtToken = new JwtToken
                    {
                        UserName = user.res_user_id,
                        Role = userRoles.ToArray(),
                        Token = new JwtSecurityTokenHandler().WriteToken(token)
                    };
                    
					var jsonResponse = JsonSerializer.Serialize(jwtToken);
                    return Content(jsonResponse, "application/json");
                }
                else
                {
                    return BadRequest("Invalid Credentials");
                }
            }
            else
            {
                return BadRequest("Username Or Password Missing");
            }
        }



        [HttpPost("Login")]
        [NonAction]
        public async Task<IActionResult> pst([FromBody] Users _userData)
        {
            if (_userData != null && _userData.UserName != null && _userData.Password != null)
            {
                var users = await _dbContext.users.ToListAsync();
                var user = users.FirstOrDefault(u => u.UserName == _userData.UserName && Decrypt(u.Password) == _userData.Password);
                if (user != null)
                {
                    var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserID",user.UserID.ToString()),
                        new Claim("UserName", user.UserName),
                        new Claim("FullName", user.FullName)
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddDays(1),
                        signingCredentials: signIn);
                    var jwtToken = new JwtToken
                    {
                        UserID = user.UserID,
                        UserName = user.UserName,
                        Token = new JwtSecurityTokenHandler().WriteToken(token)
                    };
                    userName = _userData.UserName;
                    var jsonResponse = JsonSerializer.Serialize(jwtToken);
                    return Content(jsonResponse, "application/json");
                }
                else
                {
                    return BadRequest("Invalid Credentials");
                }
            }
            else
            {
                return BadRequest("Username Or Password Missing");
            }
        }
        private string Decrypt(string cipherText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                    }
                    byte[] decryptedBytes = ms.ToArray();
                    return Encoding.Unicode.GetString(decryptedBytes);
                }
            }
        }
    }
}