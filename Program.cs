using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using anca.Configuration;
using anca.Data;

namespace anca
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                    var rolesManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                    var configuration = services.GetRequiredService<IConfiguration>();

                    DbInitializer.InitializeAsync(context, userManager, rolesManager, configuration).Wait();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding the database.");
                }
            }
 
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseKestrel(SetHost)
                .UseStartup<Startup>()
                .Build();
        
        private static void SetHost(Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions options)
        {
            var configuration = (IConfiguration)options.ApplicationServices.GetService(typeof(IConfiguration));
            var host = configuration.GetSection("RafHost").Get<Host>();
            foreach (var endpointKvp in host.Endpoints)
            {
                var endpointName = endpointKvp.Key;
                var endpoint = endpointKvp.Value;
                if (!endpoint.IsEnabled)
                {
                    continue;
                }

                var address = IPAddress.Parse(endpoint.Address);
                options.Listen(address, endpoint.Port, opt =>
                {
                    if (endpoint.Certificate != null)
                    {
                        switch (endpoint.Certificate.Source)
                        {
                            case "File":
                                opt.UseHttps(endpoint.Certificate.Path, endpoint.Certificate.Password);
                                break;
                            case "Store":
                                using (var store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
                                {
                                    store.Open(OpenFlags.ReadOnly);
                                    var certs = store.Certificates.Find(X509FindType.FindBySubjectName, "localhost", false);
                                    if (certs.Count > 0)
                                    {
                                        var certificate = certs[0];
                                        opt.UseHttps(certificate);
                                    }
                                }
                                break;
                            default:
                                throw new NotImplementedException($"The source {endpoint.Certificate.Source} is not yet implemented");
                        }

                        //opt.UseConnectionLogging();
                    }
                });

                options.UseSystemd();   //?
            }
        }
    }
}
