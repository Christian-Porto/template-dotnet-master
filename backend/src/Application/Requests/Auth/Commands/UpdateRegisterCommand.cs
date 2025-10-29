using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;

public class UpdateRegisterCommand : IRequest<UpdateRegisterResponse>
{
    public string Name { get; set; }
    public int Period { get; set; }
    public string Cpf { get; set; }
    public int Enrollment { get; set; }

    private int _id;

    public void SetId(int id)
    {
        _id = id;
    }

    public int GetId() => _id;
}

public class UpdateRegisterCommandValidator : AbstractValidator<UpdateRegisterCommand>
{
    public UpdateRegisterCommandValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("O nome � obrigat�rio.")
            .MaximumLength(256).WithMessage("O nome n�o pode exceder 256 caracteres.");

        RuleFor(c => c.Period)
            .InclusiveBetween(1, 10).WithMessage("O per�odo deve estar entre 1 e 10.");

        RuleFor(c => c.Cpf)
            .NotEmpty().WithMessage("O CPF � obrigat�rio.")
            .MaximumLength(11).WithMessage("O CPF deve conter 11 d�gitos.");

        RuleFor(c => c.Enrollment)
            .NotEmpty().WithMessage("A matr�cula � obrigat�ria.");
    }
}

public class UpdateRegisterCommandHandler : IRequestHandler<UpdateRegisterCommand, UpdateRegisterResponse>
{
    private readonly IApplicationDbContext _context;

    public UpdateRegisterCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateRegisterResponse> Handle(UpdateRegisterCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.GetId(), cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Usuario nao encontrado");
        }

        user.SetName(request.Name);
        user.SetPeriod(request.Period);
        user.SetCpf(request.Cpf);
        user.SetEnrollment(request.Enrollment);

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateRegisterResponse
        {
            Id = user.Id,
            Name = user.Name,
            Period = user.Period,
            Email = user.Email,
            Cpf = user.Cpf,
            Enrollment = user.Enrollment
        };
    }
}

