using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using anca.Data;
using anca.Data.Stores;
using anca.Models;

namespace anca.Services
{
    public class PageService : IPageService
    {
        private readonly IPageStore _pageStore;
        private readonly ICultureStore _cultureStore;
        private readonly IMapper _mapper;

        public PageService(
            IPageStore pageStore,
            ICultureStore cultureStore,
            IMapper mapper)
        {
            _pageStore = pageStore;
            _cultureStore = cultureStore;
            _mapper = mapper;
        }

        public async Task<PageViewModel> CreatePageAsync(PageViewModel pageViewModel)
        {
            if (pageViewModel == null)
                throw new ArgumentNullException(nameof(pageViewModel));

            var date = DateTime.UtcNow;
            var page = new Page
            {
                Name = pageViewModel.Name,
                Url = pageViewModel.Url,
                OrderIndex = pageViewModel.OrderIndex,
                DateCreated = date,
                LastUpdate = date,
                Active = pageViewModel.Active
            };

            var cultures = await _cultureStore.GetCultures();
            var contents = new List<Content>();
            foreach (var culture in cultures)
            {
                contents.Add(
                  new Content
                  {
                      Text = culture.Language,
                      DateCreated = date,
                      LastUpdate = date,
                      Page = page,
                      CultureId = culture.Id
                  }
                );
            }
            page = await _pageStore.CreatePageAsync(page, contents);
            var result = _mapper.Map<PageViewModel>(page);
            return result;
        }

        public async Task<PageViewModel> DeletePageAsync(int pageId)
        {
            var page = await _pageStore.GetPageByIdAsync(pageId);
            if (page == null)
                return null;

            await _pageStore.DeletePageAsync(page);
            var result = _mapper.Map<PageViewModel>(page);
            return result;
        }

        public async Task<List<PageViewModel>> GetPagesAsync()
        {
            var pages = await _pageStore.GetPagesAsync();
            var result = pages.Select(_mapper.Map<PageViewModel>).ToList();
            return result;
        }

        public async Task<PageViewModel> UpdatePageAsync(PageViewModel pageViewModel)
        {
            if (pageViewModel == null)
                throw new ArgumentNullException(nameof(pageViewModel));

            var page = await _pageStore.GetPageByIdAsync(pageViewModel.Id);
            if (page == null)
                return null;

            page.Name = pageViewModel.Name;
            page.Active = pageViewModel.Active;
            page.OrderIndex = pageViewModel.OrderIndex;
            page.LastUpdate = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(pageViewModel.Url))
                page.Url = pageViewModel.Url;

            await _pageStore.UpdatePageAsync(page);
            var result = _mapper.Map<PageViewModel>(page);
            return result;
        }
    }
}