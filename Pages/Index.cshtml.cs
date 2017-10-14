using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Localization;
using Microsoft.Extensions.Localization;

namespace site
{
    public class IndexModel : PageModel
    {
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;
        public IndexModel(IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _sharedLocalizer = sharedLocalizer;
        }
        public string Message { get; set; }
        public IActionResult OnGet()
        {
            Message = _sharedLocalizer["Test"];
            return Page();
        }
    }
}