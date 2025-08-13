using MediatR;

namespace HealthLab.Core.Application.Requests.Auth.Commands;
public class ChangePasswordCommand : IRequest<Unit>
{
    public string ValidationCode { get; set; }
    public string Password { get; set; }
}

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Unit>
{
    public ChangePasswordCommandHandler() { }

    public async Task<Unit> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {

        return Unit.Value;
    }
}

