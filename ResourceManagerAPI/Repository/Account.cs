using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
//using sun.security.util;
using System.Security.Cryptography;
using System.Text;
using static com.sun.tools.javac.tree.DCTree;

namespace ResourceManagerAPI.Repository
{
    public class Account : IAccount
    {
        private readonly PGDBContext _dbContext;
        public Account(PGDBContext connection)
        {
            _dbContext = connection;
        }
        public string AddUser(Users user)
        {
            Users objUser = new Users();
            objUser.UserName = user.UserName;
            objUser.FullName = user.FullName;
            objUser.Password = Encrypt(user.Password);
            _dbContext.users.Add(objUser);
            _dbContext.SaveChanges();
            return "{\"message\": \"Record Deleted Successfully\"}";
        }
        public string DeleteUser(Users user)
        {
            Users objUser = new Users();
            objUser.UserID = user.UserID;
            _dbContext.users.RemoveRange(objUser);
            _dbContext.SaveChanges();
            return "{\"message\": \"Record Deleted Successfully\"}";
        }
        public string Encrypt(string clearText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
    }
}
