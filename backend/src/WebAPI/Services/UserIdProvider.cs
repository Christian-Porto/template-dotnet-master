using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ExtensionEventsManager.Core.WebAPI.Services;

public class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        // Get the user ID from the "id" claim
        var userIdClaim = connection.User?.FindFirst("id")?.Value;
        return userIdClaim;
    }
}
