using ManagementExtensionActivities.Core.Application.Common.Models;
using ManagementExtensionActivities.Core.Application.Requests.Chat.Models;
using ManagementExtensionActivities.Core.Application.Requests.Chat.Queries;
using ManagementExtensionActivities.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManagementExtensionActivities.Core.WebAPI.Controllers;

[Route("chats")]
[Authorize]
public class ChatsController : ApiControllerBase
{
    [HttpGet("messages")]
    public async Task<PaginatedList<ChatMessageResponse>> ListMessages([FromQuery] ListChatMessagesQuery query)
    {
        return await Mediator.Send(query);
    }
}

