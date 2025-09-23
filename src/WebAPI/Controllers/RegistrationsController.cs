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

        [HttpPost]
        [AllowAnonymous]
        public async Task<RegistrationResponse> Create(CreateRegistrationCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<RegistrationResponse> Update([FromRoute] int id, UpdateRegistrationCommand command)
        {
            command.SetId(id);
            return await Mediator.Send(command);
        }
    }
}
