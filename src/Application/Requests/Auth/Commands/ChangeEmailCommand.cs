using MediatR;

namespace HealthLab.Core.Application.Requests.Auth.Commands;
public class ChangeEmailCommand : IRequest<Unit>
{
    public string ValidationCode { get; set; }
    public string Email { get; set; }
}

public class ChangeEmailCommandHandler : IRequestHandler<ChangeEmailCommand, Unit>
{
    public ChangeEmailCommandHandler() { }

    public async Task<Unit> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
    {

        return Unit.Value;
    }
}

