﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using Npgsql;
using System.IO;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace ResourceManagerAPI.Repository
{
    public class Account : IAccount
    {
        private readonly PGDBContext _conn;

        public Account(PGDBContext connection)
        {
            _conn = connection;
        }

        public string AddUser(string username, string password)
        {
            Users objUser = new Users();
            objUser.UserName = username;
            objUser.Password = Encrypt(password);
            _conn.users.Add(objUser);
            _conn.SaveChanges();
            return "Record Save Successfully";
        }
        public string DeleteUser(string username, string password)
        {
            Users objUser = new Users();
            objUser.UserName = username;
            objUser.Password = Decrypt(password);
            _conn.users.Remove(objUser);
            _conn.SaveChanges();
            return "Record Deleted Successfully";
        }

        private string Encrypt(string clearText)
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
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }

            return cipherText;
        }

    }

}
