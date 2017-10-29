using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;

namespace site.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class InitialReduxState
    {
        [JsonProperty("localeState")]
        public Dictionary<string, string> LocaleState { get; set; }
        [JsonProperty("pagesState")]
        public PagesState PagesState { get; set; }
    }

    public class PagesState{
        [JsonProperty("pages")]
        public List<Page> Pages { get; set; }
    }

    public class Page
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("pageName")]
        public string PageName { get; set; }
        [JsonProperty("pageUrl")]
        public string PageUrl { get; set; }
        [JsonProperty("orderIndex")]
        public int OrderIndex { get; set; }
    }
}
