using System;
using System.Collections.Generic;
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

    [Route("api/pages")]
    public class PageController : Controller
    {
        private readonly IPageService _pageService;
        private readonly ILogger<PageController> _logger;

        public PageController(
          IPageService pageService,
          IMapper mapper,
          ILogger<PageController> logger)
        {
            _pageService = pageService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _pageService.GetPagesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute GET");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PageViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _pageService.CreatePageAsync(model);
                return Created($"/{model.Url}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute POST");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] PageViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                model = await _pageService.UpdatePageAsync(model);
                if (model == null)
                    return StatusCode(404, "Page was not found");

                return Ok(model);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute PUT");
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var page = await _pageService.DeletePageAsync(id);
                if (page == null)
                    return StatusCode(404, "Page was not found");

                return Ok(page);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute DELETE");
                return StatusCode(500, ex.Message);
            }
        }
    }
}