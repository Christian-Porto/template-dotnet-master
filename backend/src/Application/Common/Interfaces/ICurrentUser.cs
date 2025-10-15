using ExtensionEventsManager.Core.Domain.Entities;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Common.Interfaces;
public interface ICurrentUser
{
    int? Id { get; }
    string? Email { get; }
    string? Name { get; }
    public ProfileEnum Profile { get; }
}
