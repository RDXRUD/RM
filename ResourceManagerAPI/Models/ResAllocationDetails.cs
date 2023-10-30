namespace ResourceManagerAPI.Models
{
    public class ResAllocationDetails
    {
        public int id { get; set; }
        public int project_id { get; set; }
        public int res_id { get; set; }
        public string res_name { get; set; }
        public int skill_id { get; set; }
        public int skillID { get; set; }
        public string skill { get; set; }
        public float allocation_perc { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
    }
}
