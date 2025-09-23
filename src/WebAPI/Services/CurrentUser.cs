using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Domain.Enums;
using System.Security.Claims;

namespace ExtensionEventsManager.Core.WebAPI.Services;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? Id => int.TryParse(_httpContextAccessor.HttpContext?.User?.FindFirstValue("id"), out int id) ? id : null;
    public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue("email");
    public string? Name => _httpContextAccessor.HttpContext?.User?.FindFirstValue("name");
    public ProfileEnum Profile => Enum.TryParse<ProfileEnum>(_httpContextAccessor.HttpContext?.User?.FindFirstValue("profile"), out var result)?result : ProfileEnum.Student;  
}
