using System;
using System.Threading.Tasks;
using AutoMapper;
using anca.Data.Stores;
using anca.Models;

namespace anca.Services
{
    public class ContentService: IContentService
    {
        private readonly IContentStore _contentStore;
        private readonly IMapper _mapper;
 
        public ContentService(IContentStore contentStore, IMapper mapper)
        {
            _contentStore = contentStore;
            _mapper = mapper;
        }

        public async Task<ContentViewModel> GetContentByPageAndLanguageAsync(int pageId, string language)
        {
            if(language == null)
                throw new ArgumentNullException(nameof(language));

            var content = await _contentStore.GetContentByPageAndLanguageAsync(pageId, language);
            if(content == null)
                return null;

            var result = _mapper.Map<ContentViewModel>(content);
            return result;
        }

        public async Task<ContentViewModel> UpdateContentAsync(ContentViewModel contentViewModel)
        {
            if(contentViewModel == null)
                throw new ArgumentNullException(nameof(contentViewModel));

            var content = await _contentStore.GetContentByIdAsync(contentViewModel.Id);
            if(content == null)
                return null;

            content.Text = contentViewModel.Text;
            content.LastUpdate = DateTime.UtcNow;
            await _contentStore.UpdateContentAsync(content);
            var result = _mapper.Map<ContentViewModel>(content);
            return result;
        }
    }
}