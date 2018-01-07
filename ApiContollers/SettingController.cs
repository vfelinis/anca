using System;
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

    [Route("api/settings")]
    public class SettingController : Controller
    {
        private readonly ISettingService _settingService;
        ILogger<SettingController> _logger;

        public SettingController(
          ISettingService settingService,
          ILogger<SettingController> logger)
        {
            _settingService= settingService;
            _logger = logger;
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] SettingViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!model.Languages.Any())
                    return BadRequest("Languages is empty");

                var setting = await _settingService.UpdateSettingAsync(model);
                if (setting == null)
                    return StatusCode(404, "Setting was not found");

                return Ok(setting);
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute PUT");
                return StatusCode(500, ex.Message);
            }
        }
    }
}