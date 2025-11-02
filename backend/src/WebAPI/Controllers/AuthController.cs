using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExtensionEventsManager.Core.Application.Requests.Auth.Commands;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Application.Requests.Auth.Queries;
using ExtensionEventsManager.Core.WebAPI.Common.Controllers;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.WebAPI.Controllers;

[Route("auth")]
[Authorize]
public class AuthController : ApiControllerBase
{
    public AuthController() { }

    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<AuthResponse> Login(LoginCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPost]
    [Route("sing-up")]
    [AllowAnonymous]
    public async Task<AuthResponse> Register(RegisterCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet]
    [Route("password/reset/{login}")]
    [AllowAnonymous]
    public async Task ResetPassword([FromRoute] string login)
    {
        await Mediator.Send(new GetResetPasswordCodeQuery { Email = login});
    }

    [HttpPost]
    [Route("password/reset/{login}")]
    [AllowAnonymous]
    public async Task ResetPassword([FromRoute] string login, [FromBody] ResetPasswordCommand command)
    {
        command.SetEmail(login);
        await Mediator.Send(command);
    }

    [HttpPut]
    [Route("register/{id}")]
    public async Task<UpdateRegisterResponse> UpdateRegister([FromRoute] int id, [FromBody] UpdateRegisterCommand command)
    {
        command.SetId(id);
        return await Mediator.Send(command);
    }

    [HttpGet]
    [Route("register")]
    public async Task<UpdateRegisterResponse> GetRegister()
    {
        return await Mediator.Send(new GetRegisterQuery());
    }

    [HttpGet]
    [Route("users")]
    public async Task<PaginatedList<UserListResponse>> ListUsers([FromQuery] ListUsersQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPut]
    [Route("users/{id}/profile")]
    public async Task<UserProfileResponse> UpdateUserProfile([FromRoute] int id, [FromBody] UpdateUserProfileCommand command)
    {
        command.SetId(id);
        return await Mediator.Send(command);
    }

    [HttpPut]
    [Route("users/{id}/status")]
    public async Task<UserStatusResponse> UpdateUserStatus([FromRoute] int id, [FromBody] UpdateUserStatusCommand command)
    {
        command.SetId(id);
        return await Mediator.Send(command);
    }
}
