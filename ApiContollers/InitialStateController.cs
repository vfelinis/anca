using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using site;
using site.Data;
using site.Models;

namespace site.ApiControllers
{
    public class InitialStateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<InitialStateController> _logger;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;
        public InitialStateController(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<InitialStateController> logger,
            IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _sharedLocalizer = sharedLocalizer;
        }

        [HttpGet]
        [Route("api/initialstate/script.js")]
        public JavaScriptResult GetScript()
        {
            var language = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
            List<PageViewModel> pages = _context.Pages.Select(_mapper.Map<PageViewModel>).ToList();
            InitialReduxState store = new InitialReduxState
            {
                LocaleState = _sharedLocalizer.GetAllStrings().ToDictionary(x => x.Name, x => x.Value),
                PagesState = new PagesState{
                    Pages = pages
                }
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