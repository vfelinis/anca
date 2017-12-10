using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace site.Models
{
    public class SettingViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [Required]
        [JsonProperty("companyName")]
        public string CompanyName { get; set; }
        [Required]
        [JsonProperty("languages")]
        public List<string> Languages { get; set; }
        [JsonProperty("supportedLanguages")]
        public List<string> SupportedLanguages { get; set; }
    }
}