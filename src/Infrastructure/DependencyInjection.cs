using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using HealthLab.Core.Application.Common.Interfaces;
using HealthLab.Core.Infrastructure.Database;
using HealthLab.Core.Infrastructure.Services;

namespace HealthLab.Core.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(
            options => options.UseMySql(
                    configuration.GetConnectionString("DefaultConnection"), 
                    new MySqlServerVersion(new Version(8, 0))
                )
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
              );

        services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>()!);
        services.AddSingleton<INotificationService, NotificationService>();

        return services;
    }
}
