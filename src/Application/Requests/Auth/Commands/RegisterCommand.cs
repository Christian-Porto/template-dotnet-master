using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;
public class RegisterCommand : IRequest<AuthResponse>
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public int Enrollment { get; set; }
    public int Period { get; set; }
    public string Cpf { get; set; }
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
                throw new BadRequestException("Login already exists");
            }

            var user = new User(request.Name, email, request.Enrollment, request.Period, request.Cpf);

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

