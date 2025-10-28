using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Events.Commands;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using ExtensionEventsManager.Core.Application.Requests.Events.Queries;
using ExtensionEventsManager.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExtensionEventsManager.Core.WebAPI.Controllers;

[Route("events")]
[Authorize]
public class EventsController : ApiControllerBase
{
    public EventsController() { }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<EventResponse> Get([FromRoute] int id)
    {
        return await Mediator.Send(new GetEventQuery { Id = id });
    }

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

    [HttpPut("{id}/status")]
    [AllowAnonymous]
    public async Task<EventResponse> UpdateStatus([FromRoute] int id, [FromBody] UpdateEventStatusCommand command)
    {
        command.SetId(id);
        return await Mediator.Send(command);
    }
}

