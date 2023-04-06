using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceManagerAPI.Models
{
    public partial class SkillSet
    {
        [Key]
        public int SkillSetID { get; set; }
        public int SkillGroupID { get; set; }
        public int SkillID { get; set; }
    }
}