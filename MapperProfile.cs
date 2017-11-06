using System;
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
        }
    }
}