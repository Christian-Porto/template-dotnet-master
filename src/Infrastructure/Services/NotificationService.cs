using HealthLab.Core.Application.Common.Interfaces;
using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Infrastructure.Services;
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
