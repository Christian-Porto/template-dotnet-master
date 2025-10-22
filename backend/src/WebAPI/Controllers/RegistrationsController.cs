using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Commands;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Queries;
using ExtensionEventsManager.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExtensionEventsManager.Core.WebAPI.Controllers
{
    [Route("registrations")]
    [Authorize]
    public class RegistrationsController : ApiControllerBase
    {
        public RegistrationsController() { }

        [HttpGet]
        [AllowAnonymous]
        public async Task<PaginatedList<RegistrationResponse>> List([FromQuery] ListRegistrationsQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("selected")]
        [AllowAnonymous]
        public async Task<PaginatedList<RegistrationResponse>> ListSelected([FromQuery] ListSelectedRegistrationsQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<RegistrationResponse> Create(CreateRegistrationCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}/attendance")]
        public async Task<RegistrationResponse> UpdateAttendance([FromRoute] int id, [FromBody] UpdateAttendanceCommand command)
        {
            command.SetId(id);
            return await Mediator.Send(command);
        }

        [HttpPut("{id}/status")]
        public async Task<RegistrationResponse> UpdateStatus([FromRoute] int id, [FromBody] UpdateRegistrationStatusCommand command)
        {
            command.SetId(id);
            return await Mediator.Send(command);
        }
    }
}
