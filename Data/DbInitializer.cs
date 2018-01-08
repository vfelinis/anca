using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace anca.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            context.Database.EnsureCreated();//if db is not exist ,it will create database .but ,do nothing .
            string adminEmail = configuration["AdminEmail"];
            string adminPassword = configuration["AdminPassword"];
            string userEmail = configuration["UserEmail"];
            string userPassword = configuration["UserPassword"];
            if (await roleManager.FindByNameAsync("admin") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("admin"));
            }
            if (await roleManager.FindByNameAsync("user") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("user"));
            }
            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                ApplicationUser admin = new ApplicationUser { Email = adminEmail, UserName = adminEmail };
                IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "admin");
                    await userManager.AddToRoleAsync(admin, "user");
                    await userManager.AddClaimsAsync(admin, new List<Claim>{
                        new Claim(OpenIdConnectConstants.Claims.Email, adminEmail)
                    });
                }
            }
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                ApplicationUser user = new ApplicationUser { Email = userEmail, UserName = userEmail };
                IdentityResult result = await userManager.CreateAsync(user, userPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");
                    await userManager.AddClaimsAsync(user, new List<Claim>{
                        new Claim(OpenIdConnectConstants.Claims.Email, userEmail)
                    });
                }
            }
            var setting = await context.Settings.FirstOrDefaultAsync();
            var supportedLanguages = configuration["SupportedLanguages"]?.Split(',')
                .Select(s => s.Trim()).ToList() ?? new List<string> { "en" };
            var defaultLanguage = supportedLanguages[0];
            if (setting == null)
            {
                setting = new Setting
                {
                    CompanyName = "CompanyName"
                };
                await context.Settings.AddAsync(setting);
            }
            setting.DefaultLanguage = defaultLanguage;

            var cultures = await context.Cultures.ToListAsync();
            var pages = await context.Pages
                .Include(p => p.Contents)
                    .ThenInclude(content => content.Culture)
                .ToListAsync();
            var date = DateTime.UtcNow;
            if (!pages.Any(p => p.Url == string.Empty))
            {
                var homePage = new Page
                {
                    Name = "Home",
                    Url = string.Empty,
                    OrderIndex = 1,
                    DateCreated = date,
                    LastUpdate = date,
                    Active = true
                };
                await context.AddAsync(homePage);
                pages.Add(homePage);
            }
            foreach (var lang in supportedLanguages)
            {
                var culture = cultures.FirstOrDefault(c => c.Language == lang);
                if (culture == null)
                {
                    culture = new Culture
                    {
                        Language = lang,
                        IsActive = lang == defaultLanguage,
                        Setting = setting
                    };
                    await context.Cultures.AddAsync(culture);
                }
                foreach (var page in pages)
                {
                    if (!page.Contents.Any(c => c.Culture.Language == lang))
                    {
                        var content = new Content
                        {
                            Text = lang,
                            DateCreated = date,
                            LastUpdate = date,
                            Page = page,
                            Culture = culture
                        };
                        await context.Contents.AddAsync(content);
                    }
                }
            }
            await context.SaveChangesAsync();
            if (!await context.Resources.AnyAsync()) {
                var defaultCulture = await context.Cultures.AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Language == defaultLanguage);
                if (defaultCulture != null) {
                    var resources = new List<Resource>();
                    var keys = ResourcesInit.GetResourcesKeys();
                    keys.ForEach(k => {
                        var resource = new Resource{
                            Key = k,
                            Value = string.Empty,
                            CultureId = defaultCulture.Id
                        };
                        resources.Add(resource);
                    });
                    await context.Resources.AddRangeAsync(resources);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}