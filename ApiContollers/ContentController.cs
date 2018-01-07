using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using anca.Data;
using anca.Models;
using anca.Services;

namespace anca.ApiControllers
{

    [Route("api/contents")]
    public class ContentController : Controller
    {
        private readonly IContentService _contentService;
        private readonly ILogger<ContentController> _logger;

        public ContentController(
          IContentService contentService,
          ILogger<ContentController> logger)
        {
            _contentService = contentService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int pageId)
        {
            try
            {
                var language = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
                var content = await _contentService.GetContentByPageAndLanguageAsync(pageId, language);
                if (content == null)
                    return StatusCode(404, "Content was not found");

                return Ok(content);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute GET");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ContentViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var content = await _contentService.UpdateContentAsync(model);
                if (content == null)
                    return StatusCode(404, "Content was not found");

                return Ok(content);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute POST");
                return StatusCode(500, ex.Message);
            }
        }
    }
}