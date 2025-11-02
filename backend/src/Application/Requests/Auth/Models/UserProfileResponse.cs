using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Models;

public class UserProfileResponse
{
    public int Id { get; set; }
    public ProfileEnum Profile { get; set; }
}

