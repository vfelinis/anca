using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace site.Models
{
    public class LocaleViewModel
    {
        [JsonProperty("currentLanguage")]
        public string CurrentLanguage { get; set; }
        [JsonProperty("locales")]
        public Locales Locales { get; set; }
    }

    public class Locales{
        [JsonProperty("en")]
        public Dictionary<string, string> EN { get; set; }
        [JsonProperty("ru")]
        public Dictionary<string, string> RU { get; set; }
    }
}