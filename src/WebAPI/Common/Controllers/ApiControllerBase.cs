using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ExtensionEventsManager.Core.WebAPI.Common.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender _mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetService<ISender>();
}