using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace anca.Data
{
    public static class ResourcesInit
    {
        public static List<string> GetResourcesKeys()
        {
            var keys = new List<string>{
                "Add",
                "Create",
                "Cancel",
                "Edit",
                "Save",
                "Delete",
                "key",
                "Inactive",
                "Admin Panel",
                "New Logo",
                "Languages",
                "Language",
                "Search",
                "New page",
                "Name",
                "Url",
                "Order index",
                "Active",
                "Yes",
                "No",
                "Error",
                "Login",
                "Logout",
                "Enter your email",
                "Enter your password",
                "Remember me",
                "Send",
                "Settings",
                "You must enter a value",
                "You must enter lowercase letters or numbers",
                "Not a valid email",
                "Configuration",
                "Pages",
                "Localization"
            };
            return keys;
        }
    }
}