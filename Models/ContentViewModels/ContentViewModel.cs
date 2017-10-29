using System;
using Newtonsoft.Json;

namespace site.Models.ContentViewModels
{
    public class ContentViewModel
    {
        [JsonProperty("text")]
        public string Text { get; set; }
    }
}