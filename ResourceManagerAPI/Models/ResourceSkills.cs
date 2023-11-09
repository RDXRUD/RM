using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceManagerAPI.Models
{
    public partial class ResourceSkills
    {
        [Key]
        public int ResourceSkillID { get; set; }
        [ForeignKey("ResourceID")]
        public int ResourceID { get; set; }
        [ForeignKey("SkillSetID")]
        public int SkillSetID { get; set; }
    }

    public partial class NewResourceSkills
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("res_id")]
             public int res_id { get; set; }
        [ForeignKey("SkillSetID")]
        public int SkillSetID { get; set; }
    }
    public class ResourceSkillSet
    {
        public int res_id { get; set; }
        public string res_name { get; set; }
        public int SkillSetID { get; set; }
        public string res_email_id { get; set; }
    }
}