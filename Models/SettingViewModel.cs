using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace anca.Models
{
    public class SettingViewModel
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [Required]
        [JsonProperty("companyName")]
        public string CompanyName { get; set; }
        [JsonProperty("defaultLanguage")]
        public string DefaultLanguage { get; set; }
        [JsonProperty("logo")]
        public string Logo { get; set; }
        [Required]
        [JsonProperty("languages")]
        public List<string> Languages { get; set; }
        [JsonProperty("supportedLanguages")]
        public List<string> SupportedLanguages { get; set; }
    }
}