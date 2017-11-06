using System;
using Newtonsoft.Json;

namespace site.Models
{
    public class ContentViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
    }
}