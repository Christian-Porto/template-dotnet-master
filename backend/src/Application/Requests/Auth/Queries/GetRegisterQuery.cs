using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Queries;

public class GetRegisterQuery : IRequest<UpdateRegisterResponse>
{
}

public class GetRegisterQueryHandler : IRequestHandler<GetRegisterQuery, UpdateRegisterResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;

    public GetRegisterQueryHandler(IApplicationDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateRegisterResponse> Handle(GetRegisterQuery request, CancellationToken cancellationToken)
    {
        var me = _currentUser.Id;
        if (!me.HasValue)
        {
            throw new UnauthorizedException();
        }

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == me.Value, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Usuário não encontrado");
        }

        return new UpdateRegisterResponse
        {
            Id = user.Id,
            Name = user.Name,
            Period = user.Period,
            Email = user.Email,
            Cpf = user.Cpf,
            Enrollment = user.Enrollment,
        };
    }
}

