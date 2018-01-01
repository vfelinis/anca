using System.Collections.Generic;
using System.Threading.Tasks;
using site.Models;

namespace site.Services
{
    public interface ILocalizationService
    {
        Task<LocaleViewModel> GetLocale(bool onlyCurrentLanguage = false);
        Task<Dictionary<string, string>> CreateResourcesAsync(Dictionary<string, string> resources);
        Task<Dictionary<string, string>> UpdateResourcesAsync(Dictionary<string, string> resources);
        Task DeleteResourcesByKeyAsync(string resourcesKey);
    }
}