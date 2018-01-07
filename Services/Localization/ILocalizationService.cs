using System.Collections.Generic;
using System.Threading.Tasks;
using anca.Models;

namespace anca.Services
{
    public interface ILocalizationService
    {
        Task<LocaleViewModel> GetLocale(bool onlyCurrentLanguage = false);
        Task<Dictionary<string, string>> CreateResourcesAsync(Dictionary<string, string> resources);
        Task<Dictionary<string, string>> UpdateResourcesAsync(Dictionary<string, string> resources);
        Task DeleteResourcesByKeyAsync(string resourcesKey);
    }
}