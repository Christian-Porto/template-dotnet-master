using AutoMapper;
using FluentValidation;
using HealthLab.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using ManagementExtensionActivities.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Entities;
using ManagementExtensionActivities.Core.Domain.Enums;
using MediatR;

namespace ManagementExtensionActivities.Core.Application.Requests.Events.Commands
{
    public class CreateEventCommand : IRequest<EventResponse>
    {
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

    public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
    {
        public CreateEventCommandValidator()
        {
            RuleFor(c => c.Name).NotEmpty().WithMessage("O nome é obrigatório."); // Fazer as validações aqui
        }
    }

    public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, EventResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateEventCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EventResponse> Handle(CreateEventCommand request, CancellationToken cancellationToken)
        {
            var @event = _mapper.Map<Event>(request);

            await _context.Events.AddAsync(@event);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<EventResponse>(@event);
        }
    }
}
