using MediatR;
using Microsoft.EntityFrameworkCore;
using HealthLab.Core.Application.Common.Interfaces;
using HealthLab.Core.Application.Exceptions;

namespace HealthLab.Core.Application.Requests.Auth.Queries;

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
            .Include(x => x.VerificationTokens)
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user != null)
        {
            var token = user.GetVerificationToken();

            try
            {
                token.IncreaseResentCount();
            }
            catch
            {
                throw new TooManyRequestsException($"Wait until {token.Expiration} to request a new token.");
            }

            await _emailService.SendPasswordResetTokenMessage(user.Email, token);

            await _context.SaveChangesAsync(cancellationToken);
        }

        return Unit.Value;
    }
}
