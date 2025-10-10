using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Commands
{
    public class UpdateRegistrationCommand : IRequest<RegistrationResponse>
    {
        private int Id { get; set; }
        public RegistrationStatusEnum? Status { get; set; }
        public bool? Attended { get; set; }
        public string? Justification { get; set; }

        public int GetId()
        {
            return Id;
        }

        public void SetId(int id)
        {
            Id = id;
        }
    }

    public class UpdateRegistrationCommandValidator : AbstractValidator<UpdateRegistrationCommand>
    {
        public UpdateRegistrationCommandValidator()
        {
            RuleFor(c => c.Justification)
                .MaximumLength(255).WithMessage("A justificativa nao pode exceder 255 caracteres.");

            RuleFor(c => c.Status)
                .Must(v => v == null || Enum.IsDefined(typeof(RegistrationStatusEnum), v))
                .WithMessage("Status de inscrição inválido.");
        }
    }

    public class UpdateRegistrationCommandHandler : IRequestHandler<UpdateRegistrationCommand, RegistrationResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateRegistrationCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RegistrationResponse> Handle(UpdateRegistrationCommand request, CancellationToken cancellationToken)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == request.GetId(), cancellationToken);

            if (registration == null)
            {
                throw new NotFoundException("Inscricao nao encontrada");
            }

            _mapper.Map(request, registration);

            _context.Registrations.Update(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}
