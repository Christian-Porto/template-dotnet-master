using HealthLab.Core.Application.Common.Interfaces;
using System.Security.Claims;

namespace HealthLab.Core.WebAPI.Services;

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

}
