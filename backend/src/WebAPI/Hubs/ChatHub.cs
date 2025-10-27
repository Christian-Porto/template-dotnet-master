using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.WebAPI.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public ChatHub(IApplicationDbContext db, ICurrentUser currentUser, IMapper mapper)
    {
        _db = db;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    private string GroupName(int chatId) => $"chat-{chatId}";

    public async Task<ChatResponse> StartOrGetChat(int otherUserId)
    {
        var me = _currentUser.Id ?? throw new HubException("Unauthorized");
        if (me == otherUserId) throw new HubException("Chat must be with another user");

        var a = Math.Min(me, otherUserId);
        var b = Math.Max(me, otherUserId);

        var chat = await _db.Chats
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.UserAId == a && c.UserBId == b);

        if (chat == null)
        {
            chat = new Chat(me, otherUserId);
            _db.Chats.Add(chat);
            await _db.SaveChangesAsync(CancellationToken.None);
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(chat.Id));

        var response = _mapper.Map<ChatResponse>(chat);
        response.Messages = chat.Messages
            .OrderBy(m => m.CreatedAtUtc)
            .Select(m => _mapper.Map<ChatMessageResponse>(m))
            .ToList();
        return response;
    }

    public async Task SendMessage(int chatId, string content)
    {
        var me = _currentUser.Id ?? throw new HubException("Unauthorized");
        content = (content ?? string.Empty).Trim();
        if (string.IsNullOrWhiteSpace(content)) throw new HubException("Message cannot be empty");

        var chat = await _db.Chats.FirstOrDefaultAsync(c => c.Id == chatId);
        if (chat == null) throw new HubException("Chat not found");
        if (!chat.HasParticipant(me)) throw new HubException("Forbidden");

        var message = chat.AddMessage(me, content);
        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync(CancellationToken.None);

        var dto = _mapper.Map<ChatMessageResponse>(message);
        
        // Send to both users directly to ensure delivery
        var otherUserId = chat.UserAId == me ? chat.UserBId : chat.UserAId;
        await Clients.User(me.ToString()).SendAsync("ReceiveMessage", dto);
        await Clients.User(otherUserId.ToString()).SendAsync("ReceiveMessage", dto);
    }
}

