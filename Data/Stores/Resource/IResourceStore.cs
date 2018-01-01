using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace site.Data.Stores
{
    public interface IResourceStore
    {
        Task<List<Resource>> GetResourcesByKeyAsync(string key);
        Task<List<Resource>> GetResourcesByKeyAndLanguagesAsync(string key, List<string> languages);
        Task<List<Resource>> CreateResourcesAsync(List<Resource> resources);
        Task<List<Resource>> UpdateResourcesAsync(List<Resource> resources);
        Task<List<Resource>> DeleteResourcesAsync(List<Resource> resources);
        Task<bool> CheckResourcesExistingByKeyAsync(string key);
    }
}