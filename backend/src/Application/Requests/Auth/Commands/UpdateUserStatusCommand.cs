using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;

[Authorize(Permission = new ProfileEnum[] { ProfileEnum.Administrator })]
public class UpdateUserStatusCommand : IRequest<UserStatusResponse>
{
    public Status Status { get; set; }

    private int _id;

    public void SetId(int id)
    {
        _id = id;
    }

    public int GetId() => _id;
}

public class UpdateUserStatusCommandValidator : AbstractValidator<UpdateUserStatusCommand>
{
    public UpdateUserStatusCommandValidator()
    {
        RuleFor(c => c.Status)
            .IsInEnum();
    }
}

public class UpdateUserStatusCommandHandler : IRequestHandler<UpdateUserStatusCommand, UserStatusResponse>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserStatusResponse> Handle(UpdateUserStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.GetId(), cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Usuario nao encontrado");
        }

        user.SetStatus(request.Status);

        await _context.SaveChangesAsync(cancellationToken);

        return new UserStatusResponse
        {
            Id = user.Id,
            Status = user.Status
        };
    }
}

