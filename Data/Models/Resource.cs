using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace site.Data
{
    public class Resource
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public int CultureId { get; set; }
        [ForeignKey(nameof(CultureId))]
        public Culture Culture { get; set; }
    }
}