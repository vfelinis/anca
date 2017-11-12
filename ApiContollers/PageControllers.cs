using System;
using System.Collections.Generic;
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

    [Route("api/pages")]
    public class PageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<PageController> _logger;

        public PageController(
          ApplicationDbContext context,
          IMapper mapper,
          ILogger<PageController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var result = _context.Pages.AsNoTracking().Select(_mapper.Map<PageViewModel>).ToList();
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
                {
                    return BadRequest(ModelState);
                }
                var date = DateTime.UtcNow;
                var page = new Page
                {
                    Name = model.Name,
                    Url = model.Url,
                    OrderIndex = model.OrderIndex,
                    DateCreated = date,
                    LastUpdate = date,
                    Active = model.Active
                };

                var cultures = await _context.Cultures.ToListAsync();
                var contents = new List<Content>();
                foreach (var culture in cultures)
                {
                    contents.Add(
                      new Content
                      {
                          Text = string.Empty,
                          DateCreated = date,
                          LastUpdate = date,
                          Page = page,
                          Culture = culture
                      }
                    );
                }

                await _context.Pages.AddAsync(page);
                await _context.Contents.AddRangeAsync(contents);
                await _context.SaveChangesAsync();

                var result = _mapper.Map<PageViewModel>(page);
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
                {
                    return BadRequest(ModelState);
                }
                var page = await _context.Pages.FirstOrDefaultAsync(p => p.Id == model.Id);
                if (page == null)
                {
                    return StatusCode(404, "Page was not found");
                }
                page.Name = model.Name;
                page.Active = model.Active;
                page.OrderIndex = model.OrderIndex;
                page.LastUpdate = DateTime.UtcNow;

                if (!string.IsNullOrWhiteSpace(model.Url)) {
                    page.Url = model.Url;
                }

                _context.Entry(page).State = EntityState.Modified;
                await _context.SaveChangesAsync();

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
                var page = await _context.Pages.FindAsync(id);
                if (page == null)
                {
                    return StatusCode(404, "Page was not found");
                }
                _context.Pages.Remove(page);
                await _context.SaveChangesAsync();
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