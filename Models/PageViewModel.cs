using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Newtonsoft.Json;

namespace site.Models
{
    public class PageViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [Required]
        [JsonProperty("name")]
        public string Name { get; set; }
        [Required]
        [MaxLength(100)]
        [JsonProperty("url")]
        public string Url { get; set; }
        [JsonProperty("orderIndex")]
        public int OrderIndex { get; set; }
        [JsonProperty("dateCreated")]
        public DateTime DateCreated { get; set; }
        [JsonProperty("active")]
        public bool Active { get; set; }
    }
}
