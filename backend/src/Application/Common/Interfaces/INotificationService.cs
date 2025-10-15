using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Common.Interfaces;
public interface INotificationService
{
    public Task SendPasswordResetTokenMessage(string address, string token);
    public Task SendVerificationTokenMessage(string address, string token);
}
