using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using site.Data.Stores;
using site.Models;

namespace site.Services
{
    public class InitialReduxStateService: IInitialReduxStateService
    {
        private readonly ILocalizationService _localizationService;
        private readonly IPageService _pageService;
        private readonly ISettingService _settingService;
        private readonly IMapper _mapper;
        
        public InitialReduxStateService(
            ILocalizationService localizationService,
            IPageService pageService,
            ISettingService settingService,
            IMapper mapper)
        {
            _localizationService = localizationService;
            _pageService = pageService;
            _settingService = settingService;
            _mapper = mapper;
        }
        public async Task<InitialReduxState> GetInitialReduxStateAsync()
        {
            var result = new InitialReduxState
            {
                LocaleState = await _localizationService.GetLocale(true),
                PageState = new PageState{
                    Pages = await _pageService.GetPagesAsync()
                },
                SettingState = await _settingService.GetFirstSettingAsync()
            };
            return result;
        }
    }
}