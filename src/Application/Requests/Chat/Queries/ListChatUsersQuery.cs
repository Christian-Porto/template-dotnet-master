using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Queries;

public class ListChatUsersQuery : IRequest<List<ChatUserResponse>>
{
}

public class ListChatUsersQueryHandler : IRequestHandler<ListChatUsersQuery, List<ChatUserResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;

    public ListChatUsersQueryHandler(IApplicationDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<ChatUserResponse>> Handle(ListChatUsersQuery request, CancellationToken cancellationToken)
    {
        var profile = _currentUser.Profile;

        var users = _context.Users
            .AsNoTracking()
            .Where(u => u.Status == Status.Active && u.Id != _currentUser.Id);

        if (profile == ProfileEnum.Monitor)
        {
            users = users.Where(u => u.Profile == ProfileEnum.Student || u.Profile == ProfileEnum.Administrator);
        }
        else if (profile == ProfileEnum.Student)
        {
            users = users.Where(u => u.Profile == ProfileEnum.Monitor || u.Profile == ProfileEnum.Administrator);
        }
        else
        {
            // Administrator: can see everyone (except self)
        }

        return await users
            .OrderBy(u => u.Name)
            .Select(u => new ChatUserResponse
            {
                Id = u.Id,
                Name = u.Name,
                Profile = u.Profile
            })
            .ToListAsync(cancellationToken);
    }
}
