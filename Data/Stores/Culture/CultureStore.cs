using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace site.Data.Stores
{
    public class CultureStore : ICultureStore
    {
        private readonly ApplicationDbContext _context;
        public CultureStore(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Culture>> GetCultures()
        {
            var culture = await _context.Cultures.AsNoTracking().ToListAsync();
            return culture;
        }

        public async Task<int> CountActiveCulturesAsync()
        {
            var culture = await _context.Cultures.AsNoTracking().Where(c => c.IsActive).CountAsync();
            return culture;
        }

        public async Task<Culture> GetActiveCultureAsync()
        {
            var culture = await _context.Cultures.AsNoTracking()
                .Include(c => c.Resources)
                .Where(c => c.IsActive)
                .FirstOrDefaultAsync();
            return culture;
        }

        public async Task<List<Culture>> GetActiveCulturesAsync()
        {
            var culture = await _context.Cultures.AsNoTracking()
                .Include(c => c.Resources)
                .Where(c => c.IsActive)
                .ToListAsync();
            return culture;
        }

        public async Task<Culture> GetCultureByLanguageAsync(string language)
        {
            if(language == null) throw new ArgumentNullException(nameof(language));
            var culture = await _context.Cultures.AsNoTracking()
                .Include(c => c.Resources)
                .Where(c => c.Language == language)
                .FirstOrDefaultAsync();
            return culture;
        }
    }
}