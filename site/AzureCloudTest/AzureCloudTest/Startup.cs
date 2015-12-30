using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AzureCloudTest.Startup))]
namespace AzureCloudTest
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
