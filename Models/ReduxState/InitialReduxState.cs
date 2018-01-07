using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using anca.Data;

namespace anca.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class InitialReduxState
    {
        [JsonProperty("localeState")]
        public LocaleViewModel LocaleState { get; set; }
        [JsonProperty("pageState")]
        public PageState PageState { get; set; }
        [JsonProperty("settingState")]
        public SettingViewModel SettingState { get; set; }
    }

    public class PageState{
        [JsonProperty("pages")]
        public List<PageViewModel> Pages { get; set; }
    }
}
