using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Commands;

public class UpdateRegisterCommand : IRequest<UpdateRegisterResponse>
{
    public string Name { get; set; }
    public int Period { get; set; }
    public string Cpf { get; set; }

    private int _id;

    public void SetId(int id)
    {
        _id = id;
    }

    public int GetId() => _id;
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
            throw new NotFoundException("Usuário não encontrado");
        }

        user.SetName(request.Name); // TODO Usar sobrecarga de construtor
        user.SetPeriod(request.Period);
        user.SetCpf(request.Cpf);

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateRegisterResponse
        {
            Id = user.Id,
            Name = user.Name,
            Period = user.Period,
            Email = user.Email,
            Cpf = user.Cpf
        };
    }
}

