using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using site.Models.ContentViewModels;

namespace site.ApiControllers
{

  [Route("api/contents")]
  public class ContentController : Controller
  {

    ILogger<ContentController> _logger;

    public ContentController(ILogger<ContentController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    public IActionResult Get(int pageId)
    {
      try
      {
        ContentViewModel model = null;
        if(pageId == 1){
          model = new ContentViewModel{
            Body = "Текс домашней страницы"
          };
        }
        if(pageId == 2){
          model = new ContentViewModel{
            Body = "Наши контакты"
          };
        }
        return Ok(model);
      }
      catch (Exception ex)
      {
        _logger.LogError("Failed to execute GET");
        return StatusCode(500, ex.Message);
      }
    }

    [HttpPost]
    public IActionResult Post([FromBody] ContentViewModel model)
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
    public IActionResult Put([FromBody] ContentViewModel model)
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
    public IActionResult Delete(int id)
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
    }
  }
}