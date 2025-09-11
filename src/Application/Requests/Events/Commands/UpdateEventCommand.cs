using AutoMapper;
using FluentValidation;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Exceptions;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using ManagementExtensionActivities.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ManagementExtensionActivities.Core.Application.Requests.Events.Commands
{
    public class UpdateEventCommand : IRequest<long>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public EventType Type { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Slots { get; set; }
        public Status Status { get; set; }
        public IList<ShiftEnum> Shifts { get; set; } = new List<ShiftEnum>();
    }

    public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
    {
        public UpdateEventCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .MaximumLength(255).WithMessage("O nome não pode exceder 255 caracteres."); ;

            RuleFor(c => c.Description)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(2056).WithMessage("A descrição não pode exceder 2056 caracteres.");

            RuleFor(c => c.Type).NotEmpty().WithMessage("O tipo do evento é obrigatório.");
            RuleFor(c => c.StartDate).NotEmpty().WithMessage("A data de início das inscrições é obrigatória.");
            RuleFor(c => c.EndDate).NotEmpty().WithMessage("A data de fim das inscrições é obrigatória.");
            RuleFor(c => c.EventDate).NotEmpty().WithMessage("A data do evento é obrigatória.");
            RuleFor(c => c.Status).NotEmpty().WithMessage("O status é obrigatório.");
            RuleFor(c => c.Slots).NotEmpty().WithMessage("O número de vagas é obrigatório.");

            RuleFor(c => c.Shifts)
           .NotEmpty().WithMessage("O turno é obrigatório.")
           .Must(shifts => shifts.Distinct().Count() == shifts.Count)
           .WithMessage("Não pode haver turnos duplicados.");

            RuleFor(c => c.StartDate)
            .LessThanOrEqualTo(c => c.EndDate)
            .WithMessage("A data de início das inscrições não pode ser posterior à data de fim.");

            RuleFor(c => c.EventDate)
            .GreaterThanOrEqualTo(c => c.EndDate)
            .WithMessage("A data do evento deve ser igual ou posterior ao fim das inscrições.");

            RuleFor(c => c.Slots)
            .GreaterThan(0)
            .WithMessage("O número de vagas deve ser maior que zero.");
            
            //Não permitir reduzir Slots abaixo de inscrições já confirmadas
        }
    }

    public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, long>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateEventCommandHandler(IApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<long> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
        {
            var Evento = await _context.Events.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (Evento == null)
            {
                throw new NotFoundException("Evento não encontrado");
            }

            _mapper.Map(request, Evento);

            _context.Events.Update(Evento);

            await _context.SaveChangesAsync(cancellationToken);

            return Evento.Id;
        }
    }




}

