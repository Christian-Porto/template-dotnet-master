using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Queries;

public class GetCurrentChatUserQuery : IRequest<ChatUserResponse>
{
}

public class GetCurrentChatUserQueryHandler : IRequestHandler<GetCurrentChatUserQuery, ChatUserResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public GetCurrentChatUserQueryHandler(IApplicationDbContext context, ICurrentUser currentUser, IMapper mapper)
    {
        _context = context;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<ChatUserResponse> Handle(GetCurrentChatUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.Id ?? throw new UnauthorizedAccessException();

        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException();
        }

        return new ChatUserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Profile = user.Profile
        };
    }
}
