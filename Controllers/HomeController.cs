using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using site.Models;

namespace site.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var fileName = "index.html";
            var contentType = "text/html";

            return File(fileName, contentType);
        }
    }
}
