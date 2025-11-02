using ExtensionEventsManager.Core.Domain.Common.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Models;

public class UserStatusResponse
{
    public int Id { get; set; }
    public Status Status { get; set; }
}

