using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using site.Models;

namespace site.Services
{
    public interface ISettingService
    {
        Task<SettingViewModel> GetFirstSettingAsync();
        Task<SettingViewModel> UpdateSettingAsync(SettingViewModel settingViewModel);
    }
}