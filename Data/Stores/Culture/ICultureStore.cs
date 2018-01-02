using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace site.Data.Stores
{
    public interface ICultureStore
    {
        Task<List<Culture>> GetCultures();
        Task<List<Culture>> GetActiveCulturesAsync();
        Task<Culture> GetCultureByLanguageAsync(string language);
    }
}