using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Queries;

public class ListChatMessagesQuery : QueryRequestBase, IRequest<PaginatedList<ChatMessageResponse>>
{
    public int? ChatId { get; set; }
    public int? OtherUserId { get; set; }
    public string? Sort { get; set; } // "asc" | "desc" (default: desc)
}

public class ListChatMessagesQueryHandler : IRequestHandler<ListChatMessagesQuery, PaginatedList<ChatMessageResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public ListChatMessagesQueryHandler(IApplicationDbContext context, ICurrentUser currentUser, IMapper mapper)
    {
        _context = context;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ChatMessageResponse>> Handle(ListChatMessagesQuery request, CancellationToken cancellationToken)
    {
        var me = _currentUser.Id ?? throw new UnauthorizedAccessException();

        int chatId;
        if (request.ChatId.HasValue)
        {
            chatId = request.ChatId.Value;
            var chat = await _context.Chats.AsNoTracking().FirstOrDefaultAsync(c => c.Id == chatId, cancellationToken);
            if (chat == null) throw new NotFoundException("Chat not found");
            if (!(chat.UserAId == me || chat.UserBId == me)) throw new ForbiddenAccessException();
        }
        else if (request.OtherUserId.HasValue)
        {
            if (request.OtherUserId.Value == me) throw new BadRequestException("otherUserId must be different from current user");
            var a = Math.Min(me, request.OtherUserId.Value);
            var b = Math.Max(me, request.OtherUserId.Value);
            var chat = await _context.Chats.AsNoTracking().FirstOrDefaultAsync(c => c.UserAId == a && c.UserBId == b, cancellationToken);
            if (chat == null) throw new NotFoundException("Chat not found");
            chatId = chat.Id;
        }
        else
        {
            throw new BadRequestException("Either ChatId or OtherUserId must be provided");
        }

        var messages = _context.ChatMessages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId);

        if (string.Equals(request.Sort, "asc", StringComparison.OrdinalIgnoreCase))
        {
            messages = messages.OrderBy(m => m.CreatedAtUtc).ThenBy(m => m.Id);
        }
        else
        {
            messages = messages.OrderByDescending(m => m.CreatedAtUtc).ThenByDescending(m => m.Id);
        }

        // Manual pagination and mapping to ensure UTC offset is preserved in serialization
        var count = await messages.CountAsync(cancellationToken);

        List<Domain.Entities.ChatMessage> pageEntities;
        if (request.PageSize == -1)
        {
            pageEntities = await messages.ToListAsync(cancellationToken);
        }
        else
        {
            var pageIndex = request.PageIndex > 0 ? request.PageIndex : 1;
            pageEntities = await messages
                .Skip((pageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);
        }

        var items = pageEntities
            .Select(m => new ChatMessageResponse
            {
                Id = m.Id,
                ChatId = m.ChatId,
                SenderId = m.SenderId,
                Content = m.Content,
                // Treat DB value as UTC and emit offset
                CreatedAtUtc = new DateTimeOffset(DateTime.SpecifyKind(m.CreatedAtUtc, DateTimeKind.Utc))
            })
            .ToList();

        return new PaginatedList<ChatMessageResponse>(items, count, request.PageIndex, request.PageSize);
    }
}
