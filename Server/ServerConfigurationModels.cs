using System.Collections.Generic;

namespace site.Configuration
{
    public class Host
    {
        public Dictionary<string, Endpoint> Endpoints { get; set; }
    }

    public class Endpoint
    {
        public bool IsEnabled { get; set; }
        public string Address { get; set; }
        public int Port { get; set; }
        public Certificate Certificate { get; set; }
    }

    public class Certificate
    {
        public string Source { get; set; }
        public string Path { get; set; }
        public string Password { get; set; }
    }
}