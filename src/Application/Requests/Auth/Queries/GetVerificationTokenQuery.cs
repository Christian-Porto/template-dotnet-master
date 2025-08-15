using MediatR;
using Microsoft.EntityFrameworkCore;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Exceptions;

namespace ManagementExtensionActivities.Core.Application.Requests.Auth.Queries;

public class GetVerificationTokenQuery : IRequest<Unit>
{

}

public class GetVerificationTokenQueryHandler : IRequestHandler<GetVerificationTokenQuery, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly INotificationService _emailService;

    public GetVerificationTokenQueryHandler(IApplicationDbContext context, ICurrentUser currentUser, INotificationService emailService)
    {
        _context = context;
        _currentUser = currentUser;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(GetVerificationTokenQuery request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.VerificationTokens)
            .FirstOrDefaultAsync(x => x.Id == _currentUser.Id);

        if (user == null)
        {
            throw new NotFoundException();
        }

        var token = user.GetVerificationToken();

        try
        {
            token.IncreaseResentCount();
        }
        catch
        {
            throw new TooManyRequestsException($"Wait until {token.Expiration} to request a new token.");
        }

        await _emailService.SendVerificationTokenMessage(user.Email, token);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
