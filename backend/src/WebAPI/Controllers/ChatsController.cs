using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Chat.Commands;
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
    [HttpGet("me")]
    public async Task<ChatUserResponse> GetMe()
    {
        return await Mediator.Send(new GetCurrentChatUserQuery());
    }

    [HttpGet]
    public async Task<List<ChatResponse>> ListChats()
    {
        return await Mediator.Send(new ListUserChatsQuery());
    }

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

    [HttpPost("messages")]
    public async Task<ChatMessageResponse> SendMessage([FromBody] SendMessageCommand command)
    {
        return await Mediator.Send(command);
    }
}
