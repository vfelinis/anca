using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace anca.Data.Stores
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

        public async Task<List<Culture>> GetActiveCulturesAsync()
        {
            var culture = await _context.Cultures.AsNoTracking()
                .Include(c => c.Resources)
                .Include(c => c.Setting)
                .Where(c => c.IsActive)
                .ToListAsync();
            return culture;
        }

        public async Task<Culture> GetCultureByLanguageAsync(string language)
        {
            if(language == null) throw new ArgumentNullException(nameof(language));
            var cultures = await _context.Cultures.AsNoTracking()
                .Include(c => c.Resources)
                .Include(c => c.Setting)
                .Where(c => c.IsActive && (c.Language == language) || c.Language == c.Setting.DefaultLanguage)
                .ToListAsync();
            var culture = cultures.Count == 1
                ? cultures.FirstOrDefault()
                : cultures.FirstOrDefault(c => c.Language == language);
            return culture;
        }
    }
}