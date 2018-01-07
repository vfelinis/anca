using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace anca.Data.Stores
{
    public class SettingStore: ISettingStore
    {
        private readonly ApplicationDbContext _context;
        public SettingStore(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Setting> GetFirstSettingAsync()
        {
            var setting = await _context.Settings.AsNoTracking().Include(s => s.Cultures).FirstOrDefaultAsync();
            return setting;
        }

        public async Task<Setting> GetSettingByIdAsync(int settingId)
        {
            var setting = await _context.Settings.Include(s => s.Cultures)
                .FirstOrDefaultAsync(s => s.Id == settingId);
            return setting;
        }

        public async Task UpdateSettingAsync(Setting setting)
        {
            _context.Entry(setting).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}