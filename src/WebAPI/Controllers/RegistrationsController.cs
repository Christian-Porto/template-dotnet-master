using ManagementExtensionActivities.Core.Application.Common.Models;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Models;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Queries;
using ManagementExtensionActivities.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementExtensionActivities.Core.WebAPI.Controllers
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
