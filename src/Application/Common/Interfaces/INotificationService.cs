using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Common.Interfaces;
public interface INotificationService
{
    public Task SendPasswordResetTokenMessage(string address, VerificationToken token);
    public Task SendVerificationTokenMessage(string address, VerificationToken token);
}
