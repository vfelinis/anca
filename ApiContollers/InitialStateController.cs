using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using site;
using site.Models;

namespace site.ApiControllers
{
    public class InitialStateController : Controller
    {

        ILogger<InitialStateController> _logger;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;
        public InitialStateController(ILogger<InitialStateController> logger, IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _logger = logger;
            _sharedLocalizer = sharedLocalizer;
        }

        [HttpGet]
        [Route("api/initialstate/script.js")]
        public JavaScriptResult GetScript()
        {
            InitialReduxState store = new InitialReduxState
            {
                LocaleState = _sharedLocalizer.GetAllStrings().ToDictionary(x => x.Name, x => x.Value),
                PagesState = new PagesState{
                    Pages = new List<Page>{
                    new Page{ Id = 1, PageName = "Home", PageUrl = "", OrderIndex = 1 },
                    new Page{ Id = 2, PageName = "Contact", PageUrl = "contact", OrderIndex = 2 }
                    }
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