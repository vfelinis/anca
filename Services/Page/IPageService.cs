using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using site.Models;

namespace site.Services
{
    public interface IPageService
    {
        Task<List<PageViewModel>> GetPagesAsync();
        Task<PageViewModel> CreatePageAsync(PageViewModel pageViewModel);
        Task<PageViewModel> UpdatePageAsync(PageViewModel pageViewModel);
        Task<PageViewModel> DeletePageAsync(int pageId);
    }
}