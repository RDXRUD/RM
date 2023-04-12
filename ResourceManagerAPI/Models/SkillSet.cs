using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public partial class SkillSet
    {
        [Key]
        public int SkillSetID { get; set; }
        [ForeignKey("SkillGroupID")]
        public int SkillGroupID { get; set; }
        [ForeignKey("SkillID")]
        public int SkillID { get; set; }
    }
}