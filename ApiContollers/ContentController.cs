using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using site.Data;
using site.Models;

namespace site.ApiControllers
{

  [Route("api/contents")]
  public class ContentController : Controller
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ContentController> _logger;

    public ContentController(
      ApplicationDbContext context,
      IMapper mapper,
      ILogger<ContentController> logger)
    {
      _context = context;
      _mapper = mapper;
      _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int pageId)
    {
      try
      {
        var language = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
        var content = await _context.Contents.FirstOrDefaultAsync(c => c.PageId == pageId && c.Language == language);
        if(content == null){
          return StatusCode(404, "Content was not found");
        }
        var result = _mapper.Map<ContentViewModel>(content);
        return Ok(result);
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
        if(!ModelState.IsValid){
          return BadRequest(ModelState);
        }
        var content = await _context.Contents.FindAsync(model.Id);
        if(content == null){
          return StatusCode(404, "Content was not found");
        }
        content.Text = model.Text;
        content.LastUpdate = DateTime.UtcNow;
        _context.Entry(content).Property(p => p.Text).IsModified = true;
        _context.Entry(content).Property(p => p.LastUpdate).IsModified = true;
        await _context.SaveChangesAsync();
        
        var result = _mapper.Map<ContentViewModel>(content);
        return Ok(result);
      }
      catch (Exception ex)
      {
        _logger.LogError("Failed to execute POST");
        return StatusCode(500, ex.Message);
      }
    }
  }
}