using System.Threading.Tasks;
using site.Models;

namespace site.Services.Localization
{
    public interface INewStringLocalizer
    {
        Task<LocaleViewModel> GetLocale(bool onlyCurrentLanguage = false);
    }
}