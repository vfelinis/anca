using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace site.Data.Stores
{
    public class ContentStore: IContentStore
    {
        private readonly ApplicationDbContext _context;
        public ContentStore(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Content> GetContentByIdAsync(int contentId)
        {
            var content = await _context.Contents.FindAsync(contentId);
            return content;
        }

        public async Task<Content> GetContentByPageAndLanguageAsync(int pageId, string language)
        {
            var content = await _context.Contents.AsNoTracking().Include(c => c.Culture)
                .FirstOrDefaultAsync(c => c.PageId == pageId && c.Culture.Language == language);
            return content;
        }

        public async Task UpdateContentAsync(Content content)
        {
            _context.Entry(content).Property(p => p.Text).IsModified = true;
            _context.Entry(content).Property(p => p.LastUpdate).IsModified = true;
            await _context.SaveChangesAsync();
        }
    }
}