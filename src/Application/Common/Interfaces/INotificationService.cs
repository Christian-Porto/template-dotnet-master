using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Application.Common.Interfaces;
public interface INotificationService
{
    public Task SendPasswordResetTokenMessage(string address, VerificationToken token);
    public Task SendVerificationTokenMessage(string address, VerificationToken token);
}
