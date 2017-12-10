using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace site.Data
{
    public class Culture
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(2)]
        public string Language { get; set; }
        public bool IsActive { get; set; }
        public int SettingId { get; set; }
        [ForeignKey(nameof(SettingId))]
        public Setting Setting { get; set; }
        public List<Resource> Resources { get; set; }
        public Culture()
        {
            Resources = new List<Resource>();
        }
    }
}