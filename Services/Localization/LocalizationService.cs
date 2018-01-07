using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using site.Data;
using site.Data.Stores;
using site.Models;

namespace site.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class LocalizationService : ILocalizationService
    {
        private readonly ICultureStore _cultureStore;
        private readonly IResourceStore _resourceStore;

        public LocalizationService(
            ICultureStore cultureStore,
            IResourceStore resourceStore)
        {
            _cultureStore = cultureStore;
            _resourceStore = resourceStore;
        }

        public async Task<Dictionary<string, string>> CreateResourcesAsync(Dictionary<string, string> resources)
        {
            if (resources == null)
                throw new ArgumentNullException(nameof(resources));

            if (!resources.ContainsKey("key") || string.IsNullOrWhiteSpace(resources["key"]))
                return new Dictionary<string, string> { ["error"] = "key is incorrect" };

            var key = resources["key"];
            var resourcesList = new List<Resource>();
            var isExist = await _resourceStore.CheckResourcesExistingByKeyAsync(key);
            if (isExist)
                return new Dictionary<string, string> { ["error"] = $"Key {key} already exists" };

            foreach (var k in resources.Keys.Where(k => k != "key"))
            {
                var culture = await _cultureStore.GetCultureByLanguageAsync(k);
                if (culture == null)
                    return new Dictionary<string, string> { ["error"] = $"Culture {k} doesn't exist" };

                var resource = new Resource
                {
                    Key = key,
                    Value = resources[k],
                    CultureId = culture.Id
                };
                resourcesList.Add(resource);
            }
            await _resourceStore.CreateResourcesAsync(resourcesList);
            return resources;
        }

        public async Task DeleteResourcesByKeyAsync(string resourcesKey)
        {
            if (resourcesKey == null)
                throw new ArgumentNullException(nameof(resourcesKey));

            var resourcesList = await _resourceStore.GetResourcesByKeyAsync(resourcesKey);
            if (resourcesList.Count > 0)
                await _resourceStore.DeleteResourcesAsync(resourcesList);
        }

        public async Task<LocaleViewModel> GetLocale(bool onlyCurrentLanguage = false)
        {
            LocaleViewModel locale = null;
            var lang = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
            if (onlyCurrentLanguage)
            {
                var culture = await _cultureStore.GetCultureByLanguageAsync(lang);
                locale = GetLocale(culture.Language, new List<Culture> { culture });
            }
            else
            {
                var cultures = await _cultureStore.GetActiveCulturesAsync();
                lang = cultures.Any(c => c.Language == lang)
                    ? lang
                    : cultures.FirstOrDefault()?.Setting.DefaultLanguage;
                locale = GetLocale(lang, cultures);
            }
            return locale;
        }

        public async Task<Dictionary<string, string>> UpdateResourcesAsync(Dictionary<string, string> resources)
        {
            if (resources == null)
                throw new ArgumentNullException(nameof(resources));

            if (!resources.ContainsKey("key") || string.IsNullOrWhiteSpace(resources["key"]))
                return new Dictionary<string, string> { ["error"] = "key is incorrect" };

            if (!resources.ContainsKey("oldKey") || string.IsNullOrWhiteSpace(resources["oldKey"]))
                return new Dictionary<string, string> { ["error"] = "old key is incorrect" };

            var oldKey = resources["oldKey"];
            var languages = resources.Keys.Where(k => k != "key" && k != "oldKey").ToList();
            var resourcesList = await _resourceStore.GetResourcesByKeyAndLanguagesAsync(oldKey, languages);
            var newResourcesList = new List<Resource>();
            if (resourcesList.Count == 0)
                return new Dictionary<string, string> { ["error"] = "resources were not found" };

            foreach (var lang in languages)
            {
                var resource = resourcesList.FirstOrDefault(r => r.Culture.Language == lang);
                if (resource != null)
                {
                    resource.Key = resources["key"];
                    resource.Value = resources[lang];
                }
                else
                {
                    var culture = await _cultureStore.GetCultureByLanguageAsync(lang);
                    if (culture != null)
                    {
                        resource = new Resource
                        {
                            Key = resources["key"],
                            Value = resources[lang],
                            CultureId = culture.Id
                        };
                        newResourcesList.Add(resource);
                    }
                    else
                    {
                        resources.Remove(lang);
                    }
                }
            }
            await _resourceStore.CreateResourcesAsync(newResourcesList);
            await _resourceStore.UpdateResourcesAsync(resourcesList);
            return resources;
        }

        private LocaleViewModel GetLocale(string language, List<Culture> data)
        {
            var result = new LocaleViewModel
            {
                CurrentLanguage = language,
                Locales = new Dictionary<string, Dictionary<string, string>>()
            };

            data.ForEach(c =>
            {
                // protection from duplicates if there are they
                var dict = c.Resources.ToDictionary(x => x.Key, x => x.Value);
                result.Locales.Add(c.Language, dict);
            });
            return result;
        }
    }
}