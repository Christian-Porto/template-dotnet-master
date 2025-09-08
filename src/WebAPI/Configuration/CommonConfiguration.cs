using Serilog;
using ManagementExtensionActivities.Core.Application;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Common.Options;
using ManagementExtensionActivities.Core.Infrastructure;
using ManagementExtensionActivities.Core.WebAPI.Services;

namespace ManagementExtensionActivities.Core.WebAPI.Configuration;

public static class CommonConfiguration
{
    public static void ConfigureBuilder(WebApplicationBuilder builder)
    {
        builder.Logging.ClearProviders();
        builder.Host.UseSerilog((hostContext, services, configuration) =>
        {
            configuration.ReadFrom.Configuration(builder.Configuration);
        });


        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(builder.Configuration);

        builder.Services.Configure<TokenSettings>(builder.Configuration.GetSection("TokenSettings"));

        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<ICurrentUser, CurrentUser>();
    }

    public static void ConfigureApp(WebApplication app)
    {
        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();
    }
}
