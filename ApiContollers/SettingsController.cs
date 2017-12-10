using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using site.Data;
using site.Models;

namespace site.ApiControllers
{

    [Route("api/settings")]
    public class SettingsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        ILogger<SettingsController> _logger;

        public SettingsController(
          ApplicationDbContext context,
          IMapper mapper,
          ILogger<SettingsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] SettingViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (!model.Languages.Any())
                {
                    return BadRequest("Languages is empty");
                }
                var settings = await _context.Settings.Include(s => s.Cultures)
                    .FirstOrDefaultAsync(s => s.Id == model.Id);
                if (settings == null)
                {
                    return NotFound();
                }
                settings.CompanyName = model.CompanyName;
                settings.Cultures.ForEach(c => c.IsActive = model.Languages.Contains(c.Language));
                await _context.SaveChangesAsync();
                return Ok(_mapper.Map<SettingViewModel>(settings));
            }
            catch (Exception ex)
            {
                _logger.LogError("Failed to execute PUT");
                return StatusCode(500, ex.Message);
            }
        }
    }
}