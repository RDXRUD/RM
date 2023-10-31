using ResourceManagerAPI.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ResourceManagerAPI.IRepository
{
    public interface IAccount
    {
        string ResourcePass(Login user);
    }
}
