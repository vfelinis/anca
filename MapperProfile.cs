using System;
using System.Linq;
using AutoMapper;
using anca.Data;
using anca.Models;

namespace anca
{
    public class MapperProfile : Profile
    {
        public MapperProfile(){
            CreateMap<Page, PageViewModel>();
            CreateMap<Content, ContentViewModel>();
            CreateMap<Setting, SettingViewModel>()
                .ForMember(dest => dest.Languages,
                    opts => opts.MapFrom(s => s.Cultures.Where(c => c.IsActive).Select(c => c.Language)))
                .ForMember(dest => dest.SupportedLanguages,
                    opts => opts.MapFrom(s => s.Cultures.Select(c => c.Language)));
        }
    }
}