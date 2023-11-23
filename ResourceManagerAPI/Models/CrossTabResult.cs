namespace ResourceManagerAPI.Models
{
    public interface ICommonReturnType
    {
        // Define common properties or methods here
    }

    public class CrossTabResult : ICommonReturnType
    {
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<DateTime, float> allocationData { get; set; }
    }

 
    public class WeeklyResult : ICommonReturnType
    {
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
    }


    public class MonthlyResult : ICommonReturnType
    {
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
    }

    public class QuarterlyResult : ICommonReturnType
    {
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
    }

    public class YearlyResult : ICommonReturnType
    {
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<int, float> allocationData { get; set; }
    }
}
