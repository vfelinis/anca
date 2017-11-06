using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace site.Data
{
    public class Content
    {
        public int Id { get; set; }
        public string Text { get; set; }
        [Required]
        [MaxLength(2)]
        public string Language { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdate { get; set; }

        public int PageId { get; set; }
        [ForeignKey(nameof(PageId))]
        public Page Page { get; set; }
    }
}