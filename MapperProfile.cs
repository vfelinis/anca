using System;
using System.Linq;
using AutoMapper;
using site.Data;
using site.Models;

namespace site
{
    public class MapperProfile : Profile
    {
        public MapperProfile(){
            CreateMap<Page, PageViewModel>();
            CreateMap<Content, ContentViewModel>();
            CreateMap<Setting, SettingViewModel>()
                .ForMember(dest => dest.Languages, opts => opts.MapFrom(s => s.Cultures.Select(c => c.Language)));
        }
    }
}