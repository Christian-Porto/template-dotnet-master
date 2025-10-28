using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using FluentValidation;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;
public class RegisterCommand : IRequest<AuthResponse>
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(256).WithMessage("O nome não pode exceder 256 caracteres.");

        RuleFor(c => c.Email)
            .NotEmpty().WithMessage("O email é obrigatório.")
            .MaximumLength(256).WithMessage("O email não pode exceder 256 caracteres.");

        RuleFor(c => c.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MaximumLength(256).WithMessage("A senha não pode exceder 256 caracteres.");
    }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    public RegisterCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var email = request.Email.ToLower().Trim().Replace(" ", "");

            var emailExists = await _context.Users.AnyAsync(x => x.Email == email);

            if (emailExists)
            {
                throw new BadRequestException("O login já existe");
            }

            var user = new User(request.Name, email);

            user.SetPassword(request.Password);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync(cancellationToken);

            return new AuthResponse
            {
                Token = _tokenService.GetToken(user)
            };
        }
        catch (Exception ex)
        {
            throw new BadRequestException(ex.Message);
        }
    }
}

