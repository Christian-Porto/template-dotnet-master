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
    public class UpdateRegistrationStatusCommand : IRequest<RegistrationResponse>
    {
        private int Id { get; set; }
        public RegistrationStatusEnum Status { get; set; }

        public int GetId() => Id;
        public void SetId(int id) => Id = id;
    }

    public class UpdateRegistrationStatusCommandValidator : AbstractValidator<UpdateRegistrationStatusCommand>
    {
        public UpdateRegistrationStatusCommandValidator()
        {
            RuleFor(c => c.Status)
                .IsInEnum();
        }
    }

    public class UpdateRegistrationStatusCommandHandler : IRequestHandler<UpdateRegistrationStatusCommand, RegistrationResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateRegistrationStatusCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RegistrationResponse> Handle(UpdateRegistrationStatusCommand request, CancellationToken cancellationToken)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == request.GetId(), cancellationToken);

            if (registration == null)
            {
                throw new NotFoundException("Inscricao nao encontrada");
            }

            registration.Status = request.Status;

            _context.Registrations.Update(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}

