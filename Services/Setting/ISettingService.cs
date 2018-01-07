using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using anca.Models;

namespace anca.Services
{
    public interface ISettingService
    {
        Task<SettingViewModel> GetFirstSettingAsync();
        Task<SettingViewModel> UpdateSettingAsync(SettingViewModel settingViewModel);
    }
}