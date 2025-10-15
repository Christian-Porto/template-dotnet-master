using ExtensionEventsManager.Core.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Queries;

public class GetResetPasswordCodeQuery : IRequest<Unit>
{
    public string Email { get; set; }
}

public class GetResetPasswordCodeQueryHandler : IRequestHandler<GetResetPasswordCodeQuery, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly INotificationService _emailService;
    public GetResetPasswordCodeQueryHandler(IApplicationDbContext context, INotificationService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(GetResetPasswordCodeQuery request, CancellationToken cancellationToken)
    {
        var email = request.Email?.ToLower().Trim().Replace(" ", "");

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user != null)
        {
            var token = user.CreatePasswordResetToken();

            await _emailService.SendPasswordResetTokenMessage(user.Email, token);

            await _context.SaveChangesAsync(cancellationToken);
        }

        return Unit.Value;
    }
}
