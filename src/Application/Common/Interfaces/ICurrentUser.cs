using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Common.Interfaces;
public interface ICurrentUser
{
    int? Id { get; }
    string? Email { get; }
    string? Name { get; }
}
