using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public partial class ResourceSkills
    {
        [Key]
        public int ResourceSkillID { get; set; }
        public int ResourceID { get; set; }
        [ForeignKey("SkillSetID")]
        public int SkillSetID { get; set; }
       
    }
}