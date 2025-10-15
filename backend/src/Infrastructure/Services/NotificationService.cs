using ExtensionEventsManager.Core.Application.Common.Interfaces;

namespace ExtensionEventsManager.Core.Infrastructure.Services;
public class NotificationService : INotificationService
{
    public async Task SendPasswordResetTokenMessage(string address, string token)
    {
        await Task.Delay(1000);
        return;
    }

    public async Task SendVerificationTokenMessage(string address, string token)
    {
        await Task.Delay(1000);
        return;
    }
}
