using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using site;
using site.Data;
using site.Models;
using site.Services.Localization;

namespace site.ApiControllers
{
    public class InitialStateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<InitialStateController> _logger;
        private readonly INewStringLocalizer _localizer;
        public InitialStateController(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<InitialStateController> logger,
            INewStringLocalizer localizer)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _localizer = localizer;
        }

        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        [Route("api/initialstate/script.js")]
        public async Task<JavaScriptResult> GetScript()
        {
            List<PageViewModel> pages = _context.Pages.AsNoTracking().Select(_mapper.Map<PageViewModel>).ToList();
            var settings = _context.Settings.AsNoTracking().Include(s => s.Cultures).FirstOrDefault();
            InitialReduxState store = new InitialReduxState
            {
                LocaleState = await _localizer.GetLocale(true),
                PagesState = new PagesState{
                    Pages = pages
                },
                SettingState = _mapper.Map<SettingViewModel>(settings)
            };
            var json = JsonConvert.SerializeObject(store);
            string script = $"window.initialReduxState = {json};";
            return new JavaScriptResult(script);
        }
    }

    public class JavaScriptResult : ContentResult
    {
        public JavaScriptResult(string script)
        {
            this.Content = script;
            this.ContentType = "application/javascript";
        }
    }
}