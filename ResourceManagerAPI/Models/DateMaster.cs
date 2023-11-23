

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
    public class WeekMaster
    {
        [Key]
        public string weekData { get; set; }

    }
    public class MonthMaster
    {
        [Key]
        public string monthData { get; set; }

    }

    public class QuarterMaster
    {
        [Key]
        public string quarterData { get; set; }
    }

    public class YearMaster
    {
        [Key]
        public string year { get; set; }
    }


}
