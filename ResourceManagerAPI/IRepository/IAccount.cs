using ResourceManagerAPI.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ResourceManagerAPI.IRepository
{
    public interface IAccount
    {
        string AddUser(Users user);
        string DeleteUser(Users user);
    }
}
