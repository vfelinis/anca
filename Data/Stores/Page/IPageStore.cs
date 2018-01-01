using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace site.Data.Stores
{
    public interface IPageStore
    {
        Task<List<Page>> GetPagesAsync();
        Task<Page> GetPageByIdAsync(int pageId);
        Task<Page> CreatePageAsync(Page page, List<Content> contents);
        Task UpdatePageAsync(Page page);
        Task DeletePageAsync(Page page);
    }
}