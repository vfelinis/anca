using System;
using Newtonsoft.Json;

namespace site.Models.ContentViewModels
{
    public class ContentViewModel
    {
        [JsonProperty("body")]
        public string Body { get; set; }
    }
}