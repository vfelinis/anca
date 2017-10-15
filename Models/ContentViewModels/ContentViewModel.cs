using System;
using Newtonsoft.Json;

namespace site.Models.ContentViewModels
{
    public class ContentViewModel
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
    }
}