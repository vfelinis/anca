using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace anca.Data.Stores
{
    public class ResourceStore : IResourceStore
    {
        private readonly ApplicationDbContext _context;
        public ResourceStore(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CheckResourcesExistingByKeyAsync(string key)
        {
            var isExist = await _context.Resources.AnyAsync(r => r.Key == key);
            return isExist;
        }

        public async Task<List<Resource>> CreateResourcesAsync(List<Resource> resources)
        {
            await _context.Resources.AddRangeAsync(resources);
            await _context.SaveChangesAsync();
            return resources;
        }

        public async Task<List<Resource>> DeleteResourcesAsync(List<Resource> resources)
        {
            _context.Resources.RemoveRange(resources);
            await _context.SaveChangesAsync();
            return resources;
        }

        public async Task<List<Resource>> GetResourcesByKeyAndLanguagesAsync(string key, List<string> languages)
        {
            var resources = await _context.Resources.Include(r => r.Culture)
                .Where(r => r.Key == key && languages.Contains(r.Culture.Language)).ToListAsync();
            return resources;
        }

        public async Task<List<Resource>> GetResourcesByKeyAsync(string key)
        {
            var resources = await _context.Resources
                .Where(r => r.Key == key).ToListAsync();
            return resources;
        }

        public async Task<List<Resource>> UpdateResourcesAsync(List<Resource> resources)
        {
            foreach(var resource in resources)
            {
                _context.Entry(resource).Property(p => p.Key).IsModified = true;
                _context.Entry(resource).Property(p => p.Value).IsModified = true;
            }
            await _context.SaveChangesAsync();
            return resources;
        }
    }
}