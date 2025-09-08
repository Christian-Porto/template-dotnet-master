using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Infrastructure.Database;
public class ApplicationSeed
{
    public static async Task SeedSampleDataAsync(ApplicationDbContext context)
    {
        if (!context.Users.Any())
        {
            var admin = new User("Administrador", "admin@stacklab.com.br");

            admin.SetPassword("stacklab@123");

            await context.Users.AddAsync(admin);
            await context.SaveChangesAsync();
        }
    }
}
