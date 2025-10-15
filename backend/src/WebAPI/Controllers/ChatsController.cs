using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Application.Requests.Chat.Queries;
using ExtensionEventsManager.Core.WebAPI.Common.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExtensionEventsManager.Core.WebAPI.Controllers;

[Route("chats")]
[Authorize]
public class ChatsController : ApiControllerBase
{
    [HttpGet("messages")]
    public async Task<PaginatedList<ChatMessageResponse>> ListMessages([FromQuery] ListChatMessagesQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("users")]
    public async Task<List<ChatUserResponse>> ListUsers()
    {
        return await Mediator.Send(new ListChatUsersQuery());
    }
}
