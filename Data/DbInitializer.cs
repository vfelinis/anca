using System;
using System.Collections.Generic;
using System.Linq;
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

            var homePage = await context.Pages.FirstOrDefaultAsync(p => p.Url == string.Empty);
            if(homePage == null){
                var date = DateTime.UtcNow;
                homePage = new Page{
                    Name = "Главная",
                    Url = string.Empty,
                    OrderIndex = 1,
                    DateCreated = date,
                    LastUpdate = date,
                    Active = true
                };
                await context.AddAsync(homePage);

                var contentRU = new Content{
                    Text = "Главная",
                    Language = "ru",
                    DateCreated = date,
                    LastUpdate = date,
                    Page = homePage
                };

                var contentEN = new Content{
                    Text = "Home",
                    Language = "en",
                    DateCreated = date,
                    LastUpdate = date,
                    Page = homePage
                };
                await context.AddRangeAsync(new List<Content>{ contentRU, contentEN });
                await context.SaveChangesAsync();
            }
        }
    }
}