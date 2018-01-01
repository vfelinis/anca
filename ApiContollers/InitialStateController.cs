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
using site.Services;

namespace site.ApiControllers
{
    public class InitialStateController : Controller
    {
        private readonly IInitialReduxStateService _initialStateService;
        private readonly ILogger<InitialStateController> _logger;
        public InitialStateController(
            IInitialReduxStateService initialStateService,
            ILogger<InitialStateController> logger)
        {
            _initialStateService = initialStateService;
            _logger = logger;
        }

        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        [Route("api/initialstate/script.js")]
        public async Task<JavaScriptResult> GetScript()
        {
            var store = await _initialStateService.GetInitialReduxStateAsync();
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