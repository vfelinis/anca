using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using site.Data;

namespace site.Services.Localization
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class CustomStringLocalizer : IStringLocalizer
    {
        private readonly ApplicationDbContext _context;
 
        public CustomStringLocalizer(ApplicationDbContext context)
        {
            _context = context;
        }
 
        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }
 
        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }
 
        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            CultureInfo.DefaultThreadCurrentCulture = culture;
            return new CustomStringLocalizer(_context);
        }
 
        public IEnumerable<LocalizedString> GetAllStrings(bool includeAncestorCultures)
        {
            List<LocalizedString> locale = new List<LocalizedString>();
            if (_context.Cultures.Where(c => c.IsActive).Count() == 1){
                locale = _context.Cultures
                    .Include(c => c.Resources)
                    .Where(c => c.IsActive)
                    .SelectMany(c => c.Resources.Select(r => new LocalizedString(r.Key, r.Value)))
                    .ToList();
            }
            else{
                locale = _context.Cultures
                    .Include(c => c.Resources)
                    .Where(c => c.Language == CultureInfo.CurrentCulture.TwoLetterISOLanguageName)
                    .SelectMany(c => c.Resources.Select(r => new LocalizedString(r.Key, r.Value)))
                    .ToList();
            }
            return locale;
        }
 
        private string GetString(string name)
        {
            return _context.Resources
                .Include(r => r.Culture)
                .Where(r => r.Culture.Language == CultureInfo.CurrentCulture.TwoLetterISOLanguageName)
                .FirstOrDefault(r => r.Key == name)?.Value;
        }
    }
}
