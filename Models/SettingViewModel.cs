using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace site.Models
{
    public class SettingViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("companyName")]
        public string CompanyName { get; set; }
        [JsonProperty("languages")]
        public List<string> Languages { get; set; }
    }
}