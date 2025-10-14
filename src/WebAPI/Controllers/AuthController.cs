using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExtensionEventsManager.Core.Application.Requests.Auth.Commands;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Application.Requests.Auth.Queries;
using ExtensionEventsManager.Core.WebAPI.Common.Controllers;

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
}
