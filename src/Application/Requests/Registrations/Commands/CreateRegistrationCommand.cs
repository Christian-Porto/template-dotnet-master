using AutoMapper;
using FluentValidation;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using MediatR;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Commands
{
    public class CreateRegistrationCommand : IRequest<RegistrationResponse>
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
    }

    public class CreateRegistrationCommandValidator : AbstractValidator<CreateRegistrationCommand>
    {
        public CreateRegistrationCommandValidator()
        {
            RuleFor(c => c.UserId).NotEmpty().WithMessage("O usuário é obrigatório.");
            RuleFor(c => c.EventId).NotEmpty().WithMessage("O evento é obrigatório.");
        }
    }

    public class CreateRegistrationCommandHandler : IRequestHandler<CreateRegistrationCommand, RegistrationResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateRegistrationCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RegistrationResponse> Handle(CreateRegistrationCommand request, CancellationToken cancellationToken)
        {
            var registration = _mapper.Map<Registration>(request);

            await _context.Registrations.AddAsync(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}
