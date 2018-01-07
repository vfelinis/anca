using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace anca.Data
{
    public class Content
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdate { get; set; }
        public int PageId { get; set; }
        [ForeignKey(nameof(PageId))]
        public Page Page { get; set; }
        public int CultureId { get; set; }
        [ForeignKey(nameof(CultureId))]
        public Culture Culture { get; set; }
    }
}