using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using site.Data;
using site.Models;

namespace site.Services.Localization
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class NewStringLocalizer : INewStringLocalizer
    {
        private readonly ApplicationDbContext _context;
 
        public NewStringLocalizer(ApplicationDbContext context)
        {
            _context = context;
        }
 
        public async Task<LocaleViewModel> GetLocale(bool onlyCurrentLanguage = false)
        {
            LocaleViewModel locale = null;
            if (await _context.Cultures.Where(c => c.IsActive).CountAsync() == 1){
                var data = await _context.Cultures
                    .Include(c => c.Resources)
                    .Where(c => c.IsActive)
                    .FirstOrDefaultAsync();
                locale = GetLocale(data?.Language, new List<Culture>{data});
            }
            else{
                var lang = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
                if(onlyCurrentLanguage){
                    var data = await _context.Cultures
                        .Include(c => c.Resources)
                        .Where(c => c.Language == lang)
                        .FirstOrDefaultAsync();
                    locale = GetLocale(lang, new List<Culture>{data});
                }
                else{
                    var data = await _context.Cultures
                        .Include(c => c.Resources)
                        .Where(c => c.IsActive)
                        .ToListAsync();
                    locale = GetLocale(lang, data);
                }
            }
            return locale;
        }

        private LocaleViewModel GetLocale(string language, List<Culture> data)
        {
            return new LocaleViewModel{
                CurrentLanguage = language,
                Locales = new Locales{
                    EN = data?.FirstOrDefault(c => c.Language == "en")?.Resources.ToDictionary(x => x.Key, x => x.Value)
                        ?? new Dictionary<string, string>(),
                    RU = data?.FirstOrDefault(c => c.Language == "ru")?.Resources.ToDictionary(x => x.Key, x => x.Value)
                        ?? new Dictionary<string, string>()
                }
            };
        }
    }
}