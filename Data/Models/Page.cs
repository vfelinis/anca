using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace site.Data
{
    public class Page
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [MaxLength(100)]
        public string Url { get; set; }
        public int OrderIndex { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdate { get; set; }
        public bool Active { get; set; }

        public List<Content> Contents { get; set; }

        public Page(){
            Contents = new List<Content>();
        }
    }
}
