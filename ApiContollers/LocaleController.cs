using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using site.Data;
using site.Services;

namespace site.ApiControllers
{

    [Route("api/locales")]
    public class LocaleController : Controller
    {
        private readonly ILocalizationService _localizationService;
        ILogger<LocaleController> _logger;

        public LocaleController(
          ILocalizationService localizationService,
          ILogger<LocaleController> logger)
        {
            _localizationService = localizationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get(bool onlyCurrentLanguage = false)
        {
            try
            {
                var localeState = await _localizationService.GetLocale(onlyCurrentLanguage);
                return Ok(localeState);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute GET");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Dictionary<string, string> resources)
        {
            try
            {
                if (resources == null)
                    return BadRequest("resources are empty");

                resources = await _localizationService.CreateResourcesAsync(resources);
                if(resources.Count == 1 && resources.ContainsKey("error"))
                    return BadRequest(resources["error"]);

                return Ok(resources);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute POST");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Dictionary<string, string> resources)
        {
            try
            {
                if (resources == null)
                    return BadRequest("resources are empty");

                resources = await _localizationService.UpdateResourcesAsync(resources);
                if(resources.Count == 1 && resources.ContainsKey("error"))
                    return BadRequest(resources["error"]);

                return Ok(resources);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute PUT");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        public async Task<IActionResult> Delete(string resourcesKey)
        {
            try
            {
                if (resourcesKey == null)
                    return BadRequest("resources key is empty");

                await _localizationService.DeleteResourcesByKeyAsync(resourcesKey);
                return Ok(new {resourcesKey});
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute DELETE");
                return StatusCode(500, ex.Message);
            }
        }
    }
}