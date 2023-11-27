using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class ResourceSkillManager
    {
        public int ResourceID { get; set; }
        public int SkillGroupID { get; set; }
        public int SkillID { get; set; }
        public int ResourceSkillID { get; set; }
        public int SkillSetID { get; set; }
        public string? EmailID { get; set; }
        public string? SkillGroup { get; set; }
        public string? Skill { get; set; }
        public DateTime last_modified { get; set; }
        public int modified_by { get;}
    }

    public class GroupedResourceSkill
    {
        public int ResourceID { get; set; }
        public string ResourceName { get; set; }
        public string EmailID { get; set; }
        public string SkillGroup { get; set; }
        public string Skills { get; set; }
    }

}