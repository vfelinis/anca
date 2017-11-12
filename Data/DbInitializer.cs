using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace site.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            context.Database.EnsureCreated();//if db is not exist ,it will create database .but ,do nothing .
            string adminEmail = "admin@admin";
            string adminPassword = "admin";
            string userEmail = "user@user";
            string userPassword = "user";
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
                    await userManager.AddClaimAsync(admin, new Claim(ClaimTypes.Role, "admin"));
                }
            }
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                ApplicationUser user = new ApplicationUser { Email = userEmail, UserName = userEmail };
                IdentityResult result = await userManager.CreateAsync(user, userPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "user");
                }
            }

            var setting = await context.Settings.AsNoTracking().FirstOrDefaultAsync();
            if (setting == null)
            {
                setting = new Setting
                {
                    CompanyName = "CompanyName"
                };
                await context.Settings.AddAsync(setting);

                var cultureRU = new Culture
                {
                    Language = "ru",
                    Setting = setting
                };
                var cultureEN = new Culture
                {
                    Language = "en",
                    Setting = setting
                };
                await context.Cultures.AddRangeAsync(new List<Culture> { cultureRU, cultureEN });

                var resourceRU = new Resource
                {
                    Key = "Admin Panel",
                    Value = "Панель управления",
                    Culture = cultureRU
                };
                var resourceEN = new Resource
                {
                    Key = "Admin Panel",
                    Value = "Admin Panel",
                    Culture = cultureEN
                };
                await context.Resources.AddRangeAsync(new List<Resource> { resourceRU, resourceEN });

                var date = DateTime.UtcNow;
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

                var contentRU = new Content
                {
                    Text = "Главная",
                    DateCreated = date,
                    LastUpdate = date,
                    Page = homePage,
                    Culture = cultureRU
                };

                var contentEN = new Content
                {
                    Text = "Home",
                    DateCreated = date,
                    LastUpdate = date,
                    Page = homePage,
                    Culture = cultureEN
                };
                await context.AddRangeAsync(new List<Content> { contentRU, contentEN });

                await context.SaveChangesAsync();
            }
        }
    }
}