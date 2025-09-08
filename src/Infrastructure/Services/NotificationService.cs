using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Infrastructure.Services;
public class NotificationService : INotificationService
{
    public async Task SendPasswordResetTokenMessage(string address, VerificationToken token)
    {
        await Task.Delay(1000);
        return;
    }

    public async Task SendVerificationTokenMessage(string address, VerificationToken token)
    {
        await Task.Delay(1000);
        return;
    }
}
