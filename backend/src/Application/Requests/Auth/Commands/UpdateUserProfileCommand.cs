using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;

[Authorize(Permission = new ProfileEnum[] { ProfileEnum.Administrator })]
public class UpdateUserProfileCommand : IRequest<UserProfileResponse>
{
    public ProfileEnum Profile { get; set; }

    private int _id;

    public void SetId(int id)
    {
        _id = id;
    }

    public int GetId() => _id;
}

public class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileCommandValidator()
    {
        RuleFor(c => c.Profile)
            .Must(p => p == ProfileEnum.Monitor || p == ProfileEnum.Student)
            .WithMessage("Perfil inválido. Use Monitor ou Student.");
    }
}

public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, UserProfileResponse>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserProfileCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileResponse> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.GetId(), cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Usuario nao encontrado");
        }

        user.SetProfile(request.Profile);

        await _context.SaveChangesAsync(cancellationToken);

        return new UserProfileResponse
        {
            Id = user.Id,
            Profile = user.Profile
        };
    }
}

