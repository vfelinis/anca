using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using site.Data;
using site.Services.Localization;

namespace site.ApiControllers
{

    [Route("api/locale")]
    public class LocaleController : Controller
    {
        private readonly INewStringLocalizer _localizer;
        ILogger<LocaleController> _logger;

        public LocaleController(
          INewStringLocalizer localizer,
          ILogger<LocaleController> logger)
        {
            _localizer = localizer;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get(bool onlyCurrentLanguage = false)
        {
            try
            {
                var localeState = await _localizer.GetLocale(onlyCurrentLanguage);
                return Ok(localeState);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute GET");
                return StatusCode(500, ex.Message);
            }
        }

        /*[HttpPost]
        public IActionResult Post([FromBody] modelType model)
        {
            try
            {
                return Created("", null);
            }
            catch (Exception)
            {
                _logger.LogError("Failed to execute POST");
                return BadRequest();
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] modelType model)
        {
            try
            {
                return Ok();
            }
            catch (Exception)
            {
                _logger.LogError("Failed to execute PUT");
                return BadRequest();
            }
        }

        [HttpDelete]
        public IActionResult Delete(inputType id)
        {
            try
            {
                return Ok();
            }
            catch (Exception)
            {
                _logger.LogError("Failed to execute DELETE");
                return BadRequest();
            }
        }*/
    }
}