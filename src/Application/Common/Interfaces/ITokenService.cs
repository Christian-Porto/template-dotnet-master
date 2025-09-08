using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Common.Interfaces;

public interface ITokenService
{
    string GetToken(User user);
}
