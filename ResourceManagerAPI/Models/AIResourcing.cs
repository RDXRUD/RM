namespace ResourceManagerAPI.Models
{
    public class AIResourcing
    {

    }

    public class AIModel
    {
        public int[]? location {  get; set; }
        public int[]? skillSetID { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public string? report_type { get; set; }

    }
    public class CrossAIJoin
    {
        public int id { get; set; }
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public int skill_id { get; set; }
        public string skill {  get; set; }
        public int skill_group_id { get; set; }
        public string skillGroup { get; set; }
        public string skill_set_id { get; set; }
        public float allocation_perc { get; set; }
        public string day { get; set; }
        public DateTime date { get; set; }

    }
    public class CrossTabAIResult : ICommonReturnType
    {
        public int res_id { get; set; }

        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<DateTime, float> allocationData { get; set; }
        public int skill_id { get; set; }
        public string skill { get; set; }
        public int skill_group_id { get; set; }
        public string skillGroup { get; set; }
        public string skill_set_id { get; set; }
    }
    public class CustomResult
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public float allocationData { get; set; }
        public float availableData { get; set; }
    }

    public class WeeklyAIResult 
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
        public Dictionary<string, float> availableData { get; set; }

    }
    public class MonthlyAIResult 
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
        public Dictionary<string, float> availableData { get; set; }
    }

    public class QuarterlyAIResult 
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<string, float> allocationData { get; set; }
        public Dictionary<string, float> availableData { get; set; }

    }

    public class YearlyAIResult 
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public string res_email_id { get; set; }
        public Dictionary<int, float> allocationData { get; set; }
        public Dictionary<int, float> availableData { get; set; }

    }
}
