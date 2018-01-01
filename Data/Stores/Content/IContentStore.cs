using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace site.Data.Stores
{
    public interface IContentStore
    {
        Task<Content> GetContentByIdAsync(int contentId);
        Task<Content> GetContentByPageAndLanguageAsync(int pageId, string language);
        Task UpdateContentAsync(Content content);
    }
}