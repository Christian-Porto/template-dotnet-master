using Serilog;
using ExtensionEventsManager.Core.Application;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Options;
using ExtensionEventsManager.Core.Infrastructure;
using ExtensionEventsManager.Core.WebAPI.Services;

namespace ExtensionEventsManager.Core.WebAPI.Configuration;

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

        // Real-time
        builder.Services.AddSignalR();
    }

    public static void ConfigureApp(WebApplication app)
    {
        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        // SignalR hubs
        app.MapHub<ExtensionEventsManager.Core.WebAPI.Hubs.ChatHub>("/hubs/chat");
    }
}
