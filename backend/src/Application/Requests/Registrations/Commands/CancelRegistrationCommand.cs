using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Commands
{
    [Authorize(Permission = new ProfileEnum[] { ProfileEnum.Student, ProfileEnum.Monitor })]
    public class CancelRegistrationCommand : IRequest
    {
        public int EventId { get; set; }
    }

    public class CancelRegistrationCommandValidator : AbstractValidator<CancelRegistrationCommand>
    {
        public CancelRegistrationCommandValidator()
        {
            RuleFor(c => c.EventId)
                .NotEmpty().WithMessage("O evento é obrigatório.");
        }
    }

    public class CancelRegistrationCommandHandler : IRequestHandler<CancelRegistrationCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUser _currentUser;

        public CancelRegistrationCommandHandler(IApplicationDbContext context, ICurrentUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task Handle(CancelRegistrationCommand request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                throw new BadRequestException("Usuário não autenticado.");
            }

            // Validate event exists and is open for registration (same rule as Create)
            var evt = await _context.Events
                .AsNoTracking()
                .Where(e => e.Id == request.EventId)
                .Select(e => new { e.Id, e.StartDate, e.EndDate })
                .FirstOrDefaultAsync(cancellationToken);

            if (evt is null)
            {
                throw new NotFoundException($"Evento com id {request.EventId} não foi encontrado.");
            }

            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var notStarted = evt.StartDate >= tomorrow;
            var closed = evt.EndDate < today;

            if (notStarted || closed)
            {
                var message = notStarted
                    ? "Inscrições não iniciadas para este evento."
                    : "Inscrições encerradas para este evento.";
                throw new BadRequestException(message);
            }

            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.EventId == request.EventId && r.UserId == userId.Value, cancellationToken);

            if (registration is null)
            {
                throw new NotFoundException("Inscrição não encontrada para o usuário no evento informado.");
            }

            if (registration.Status == RegistrationStatusEnum.Selected)
            {
                throw new BadRequestException("Sua inscrição foi aprovada, o cancelamento não está disponível.");
            }

            if (registration.Status == RegistrationStatusEnum.NotSelected)
            {
                throw new BadRequestException("Sua inscrição não foi aprovada, não há cancelamento a realizar.");
            }

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
