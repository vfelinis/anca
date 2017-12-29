using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using site.Data;

namespace site.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class InitialReduxState
    {
        [JsonProperty("localeState")]
        public LocaleViewModel LocaleState { get; set; }
        [JsonProperty("pagesState")]
        public PagesState PagesState { get; set; }
        [JsonProperty("settingsState")]
        public SettingViewModel SettingState { get; set; }
    }

    public class PagesState{
        [JsonProperty("pages")]
        public List<PageViewModel> Pages { get; set; }
    }
}
