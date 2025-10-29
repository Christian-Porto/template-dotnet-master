using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Commands
{
    public class CreateRegistrationCommand : IRequest<RegistrationResponse>
    {
        public int EventId { get; set; }
    }

    public class CreateRegistrationCommandValidator : AbstractValidator<CreateRegistrationCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateRegistrationCommandValidator(IApplicationDbContext context)
        {
            _context = context;

            RuleFor(c => c.EventId)
                .NotEmpty().WithMessage("O evento é obrigatório.");
        }
    }

    public class CreateRegistrationCommandHandler : IRequestHandler<CreateRegistrationCommand, RegistrationResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;

        public CreateRegistrationCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUser currentUser )
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<RegistrationResponse> Handle(CreateRegistrationCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == _currentUser.Id);

            if (user is null)
            {
                throw new BadRequestException("Usuário não encontrado.");
            }

            if (user.Period <= 0)
            {
                throw new BadRequestException("O usuário deve ter período preenchido.");
            }

            if (string.IsNullOrWhiteSpace(user.Cpf))
            {
                throw new BadRequestException("O usuário deve ter CPF preenchido.");
            }

            // Validate event exists and is open for registration
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

            // Prevent duplicate registration for the same event by the same user
            var alreadyRegistered = await _context.Registrations
                .AnyAsync(r => r.UserId == user.Id && r.EventId == request.EventId, cancellationToken);

            if (alreadyRegistered)
            {
                throw new BadRequestException("Usuário já está inscrito neste evento.");
            }

            var registration = _mapper.Map<Registration>(request);
            // Set FK to current user to satisfy Users->Registrations constraint
            registration.UserId = user.Id;
            registration.Status = RegistrationStatusEnum.Registered;

            await _context.Registrations.AddAsync(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}
