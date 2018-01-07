using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace anca.Data.Stores
{
    public class PageStore: IPageStore
    {
        private readonly ApplicationDbContext _context;
        public PageStore(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Page> CreatePageAsync(Page page, List<Content> contents)
        {
            await _context.Pages.AddAsync(page);
            await _context.Contents.AddRangeAsync(contents);
            await _context.SaveChangesAsync();
            return page;
        }

        public async Task DeletePageAsync(Page page)
        {
            _context.Pages.Remove(page);
            await _context.SaveChangesAsync();
        }

        public async Task<Page> GetPageByIdAsync(int pageId)
        {
            var page = await _context.Pages.FindAsync(pageId);
            return page;
        }

        public async Task<List<Page>> GetPagesAsync()
        {
            var result = await _context.Pages.AsNoTracking().ToListAsync();
            return result;
        }

        public async Task UpdatePageAsync(Page page)
        {
            _context.Entry(page).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}