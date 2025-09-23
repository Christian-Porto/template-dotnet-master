using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;
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
            .Where(x => x.Email == request.GetEmail())
            .Where(x => !string.IsNullOrEmpty(x.ResetPasswordToken))
            .Where(x => x.ResetPasswordToken == request.Token)
            .Where(x => x.ResetPasswordTokenExpiration > DateTime.Now)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            throw new UnauthorizedException();
        }

        user.SetPassword(request.Password);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

