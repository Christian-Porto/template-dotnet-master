using ManagementExtensionActivities.Core.Application.Common.Models;
using ManagementExtensionActivities.Core.Application.Requests.Events.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using ManagementExtensionActivities.Core.Application.Requests.Events.Queries;
using ManagementExtensionActivities.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementExtensionActivities.Core.WebAPI.Controllers;

[Route("events")]
[Authorize]
public class EventsController : ApiControllerBase
{
    public EventsController() { }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PaginatedList<EventResponse>> List([FromQuery] ListEventsQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<EventResponse> Create(CreateEventCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut ("{id}")]
    [AllowAnonymous]
    public async Task<EventResponse> Update([FromRoute] int id, UpdateEventCommand command)
    {
        command.SetId(id);
        return await Mediator.Send(command);
    }
}

