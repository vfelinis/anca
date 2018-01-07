using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using anca.Data.Stores;
using anca.Models;

namespace anca.Services
{
    public class SettingService : ISettingService
    {
        private readonly ISettingStore _settingsStore;
        private readonly IMapper _mapper;

        public SettingService(ISettingStore settingsStore, IMapper mapper)
        {
            _settingsStore = settingsStore;
            _mapper = mapper;
        }

        public async Task<SettingViewModel> GetFirstSettingAsync()
        {
            var setting = await _settingsStore.GetFirstSettingAsync();
            var result = _mapper.Map<SettingViewModel>(setting);
            return result;
        }

        public async Task<SettingViewModel> UpdateSettingAsync(SettingViewModel settingViewModel)
        {
            if(settingViewModel == null)
                throw new ArgumentNullException(nameof(settingViewModel));

            var setting = await _settingsStore.GetSettingByIdAsync(settingViewModel.Id);
            if (setting == null)
                return null;

            setting.CompanyName = settingViewModel.CompanyName;
            setting.Logo = settingViewModel.Logo;
            setting.Cultures.ForEach(c => 
                c.IsActive = settingViewModel.Languages.Contains(c.Language) || c.Language == setting.DefaultLanguage);
            await _settingsStore.UpdateSettingAsync(setting);
            var result = _mapper.Map<SettingViewModel>(setting);
            return result;
        }
    }
}