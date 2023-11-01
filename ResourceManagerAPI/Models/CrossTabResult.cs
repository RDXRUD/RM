namespace ResourceManagerAPI.Models
{
    public class CrossTabResult
    {
        public string res_name { get; set; }
        public Dictionary<DateTime, float> allocationData{ get; set; }
    }
}
