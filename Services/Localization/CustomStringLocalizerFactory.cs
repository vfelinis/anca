using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using site.Data;

namespace site.Services.Localization
{
    public class CustomStringLocalizerFactory : IStringLocalizerFactory
    {
        string _connectionString;
        public CustomStringLocalizerFactory(string connection)
        {
            _connectionString = connection;
        }
 
        public IStringLocalizer Create(Type resourceSource)
        {
            return CreateStringLocalizer();
        }
 
        public IStringLocalizer Create(string baseName, string location)
        {
            return CreateStringLocalizer();
        }
 
        private IStringLocalizer CreateStringLocalizer()
        {
            ApplicationDbContext _context = new ApplicationDbContext(
                new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlite(_connectionString)
                    .Options);
        
            return new CustomStringLocalizer(_context);
        }
    }
}