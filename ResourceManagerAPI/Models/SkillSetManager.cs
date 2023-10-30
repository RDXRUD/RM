namespace ResourceManagerAPI.Models
{
    public class SkillSetManager
    {
        public int SkillSetID { get; set; }
        public int SkillGroupID { get; set; }
        public int SkillID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Skill { get; set; }
        public string? Description { get; set; }

        public string? status { get; set; }
    }
}