using ManagementExtensionActivities.Core.Application.Requests.Registrations.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Models;
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

        [HttpPost]
        [AllowAnonymous]
        public async Task<RegistrationResponse> Create(CreateRegistrationCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}
