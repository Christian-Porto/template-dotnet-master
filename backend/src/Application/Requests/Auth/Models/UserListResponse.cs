using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Models;

public class UserListResponse
{
    public string Name { get; set; } = string.Empty;
    public int? Enrollment { get; set; }
    public ProfileEnum Profile { get; set; }
    public Status Status { get; set; }
}

