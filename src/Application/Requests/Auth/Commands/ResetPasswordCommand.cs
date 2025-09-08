using MediatR;
using Microsoft.EntityFrameworkCore;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Exceptions;

namespace ManagementExtensionActivities.Core.Application.Requests.Auth.Commands;
public class ResetPasswordCommand : IRequest<Unit>
{
    public string Password { get; set; }
    public string Token { get; set; }

    private string Email { get; set; }

    public void SetEmail(string email)
    {

        Email = email;
    }

    public string GetEmail()
    {
        return Email;
    }
}

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly INotificationService _emailService;
    public ResetPasswordCommandHandler(IApplicationDbContext context, INotificationService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(x => x.VerificationTokens)
            .FirstOrDefaultAsync(x => x.Email == request.GetEmail());

        if (user == null || !user.ValidateToken(request.Token))
        {
            throw new UnauthorizedException();
        }

        user.SetPassword(request.Password);

        user.ClearVerificationTokens(all: true);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

