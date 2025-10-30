using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Queries;

public class ListUserChatsQuery : IRequest<List<ChatResponse>>
{
}

public class ListUserChatsQueryHandler : IRequestHandler<ListUserChatsQuery, List<ChatResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public ListUserChatsQueryHandler(IApplicationDbContext context, ICurrentUser currentUser, IMapper mapper)
    {
        _context = context;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<List<ChatResponse>> Handle(ListUserChatsQuery request, CancellationToken cancellationToken)
    {
        var me = _currentUser.Id ?? throw new UnauthorizedAccessException();

        var chats = await _context.Chats
            .AsNoTracking()
            .Include(c => c.Messages)
            .Where(c => c.UserAId == me || c.UserBId == me)
            .OrderByDescending(c => c.Messages.Max(m => (DateTime?)m.CreatedAtUtc) ?? DateTime.MinValue)
            .ToListAsync(cancellationToken);

        // Map to response and order messages
        var chatResponses = chats.Select(chat => {
            var response = _mapper.Map<ChatResponse>(chat);
            response.Messages = chat.Messages
                .OrderBy(m => m.CreatedAtUtc)
                .ThenBy(m => m.Id)
                .Select(m => _mapper.Map<ChatMessageResponse>(m))
                .ToList();
            return response;
        }).ToList();

        return chatResponses;
    }
}
