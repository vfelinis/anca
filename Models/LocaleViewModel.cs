using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace anca.Models
{
    public class LocaleViewModel
    {
        [JsonProperty("currentLanguage")]
        public string CurrentLanguage { get; set; }
        [JsonProperty("locales")]
        public Dictionary<string, Dictionary<string, string>> Locales { get; set; }
    }
}