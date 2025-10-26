using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Events.Commands
{
    [Authorize(Permission = new ProfileEnum[] { ProfileEnum.Administrator, ProfileEnum.Monitor })]
    public class UpdateEventCommand : IRequest<EventResponse>
    {
        private int Id { get; set; }
        public string Name { get; set; }
        public EventTypeEnum Type { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Slots { get; set; }
        public IList<ShiftEnum> Shifts { get; set; } = new List<ShiftEnum>();

        public int GetId() => Id;
        public void SetId(int id) => Id = id;
    }

    public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
    {
        public UpdateEventCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .MaximumLength(255).WithMessage("O nome não pode exceder 255 caracteres.");

            RuleFor(c => c.Description)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(2056).WithMessage("A descrição não pode exceder 2056 caracteres.");

            RuleFor(c => c.Type)
                .NotEmpty().WithMessage("O tipo do evento é obrigatório.")
                .Must(v => Enum.IsDefined(typeof(EventTypeEnum), v)).WithMessage("Tipo de evento inválido.");

            RuleFor(c => c.StartDate).NotEmpty().WithMessage("A data de início das inscrições é obrigatória.");
            RuleFor(c => c.EndDate).NotEmpty().WithMessage("A data de fim das inscrições é obrigatória.");
            RuleFor(c => c.EventDate).NotEmpty().WithMessage("A data do evento é obrigatória.");

            RuleFor(c => c.Slots)
                .NotEmpty().WithMessage("O número de vagas é obrigatório.")
                .GreaterThan(0).WithMessage("O número de vagas deve ser maior que zero.");

            RuleFor(c => c.Shifts)
               .NotEmpty().WithMessage("O turno é obrigatório.")
               .Must(shifts => shifts.Distinct().Count() == shifts.Count)
               .WithMessage("Não pode haver turnos duplicados.");

            RuleForEach(c => c.Shifts)
                .Must(v => Enum.IsDefined(typeof(ShiftEnum), v)).WithMessage("Turno inválido.");

            RuleFor(c => c.StartDate)
                .LessThanOrEqualTo(c => c.EndDate)
                .WithMessage("A data de início das inscrições não pode ser posterior à data de fim.");

            RuleFor(c => c.EventDate)
                .GreaterThanOrEqualTo(c => c.EndDate)
                .WithMessage("A data do evento deve ser igual ou posterior ao fim das inscrições.");

            // Não permitir reduzir Slots abaixo de inscrições já confirmadas (se aplicável) – regra de negócio futura.
        }
    }

    public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, EventResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateEventCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EventResponse> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
        {
            var @event = await _context.Events
                .Include(e => e.Shifts)
                .FirstOrDefaultAsync(x => x.Id == request.GetId(), cancellationToken);

            if (@event == null)
            {
                throw new NotFoundException("Evento não encontrado");
            }

            _mapper.Map(request, @event);

            // Replace Shifts with existing rows matching the request
            @event.Shifts.Clear();
            var existingShifts = await _context.Shifts
                .Where(s => request.Shifts.Contains(s.Name))
                .ToListAsync(cancellationToken);
            foreach (var shift in existingShifts)
            {
                @event.Shifts.Add(shift);
            }

            _context.Events.Update(@event);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<EventResponse>(@event);
        }
    }
}
