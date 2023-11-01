

using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public class DateMaster
    {
        [Key]
        public int date_id { get; set; }
        public DateTime date { get; set; }
        public string day { get; set; }
    }
}
