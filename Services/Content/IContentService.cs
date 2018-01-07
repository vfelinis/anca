using System.Threading.Tasks;
using anca.Models;

namespace anca.Services
{
    public interface IContentService
    {
        Task<ContentViewModel> GetContentByPageAndLanguageAsync(int pageId, string language);
        Task<ContentViewModel> UpdateContentAsync(ContentViewModel contentViewModel);
    }
}