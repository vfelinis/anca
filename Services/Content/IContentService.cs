using System.Threading.Tasks;
using site.Models;

namespace site.Services
{
    public interface IContentService
    {
        Task<ContentViewModel> GetContentByPageAndLanguageAsync(int pageId, string language);
        Task<ContentViewModel> UpdateContentAsync(ContentViewModel contentViewModel);
    }
}