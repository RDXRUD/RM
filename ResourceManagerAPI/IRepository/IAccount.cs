using ResourceManagerAPI.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ResourceManagerAPI.IRepository
{
    public interface IAccount
    {
        string AddUser(string username, string password);
        string DeleteUser(string username, string password);
    }
}
