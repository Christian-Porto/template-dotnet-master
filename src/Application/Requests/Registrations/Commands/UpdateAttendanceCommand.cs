using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Commands
{
    public class UpdateAttendanceCommand : IRequest<RegistrationResponse>
    {
        private int Id { get; set; }
        public bool? Attended { get; set; }
        public string? Justification { get; set; }

        public int GetId() => Id;
        public void SetId(int id) => Id = id;
    }

    public class UpdateAttendanceCommandValidator : AbstractValidator<UpdateAttendanceCommand>
    {
        public UpdateAttendanceCommandValidator()
        {
            RuleFor(c => c.Justification)
                .MaximumLength(255).WithMessage("A justificativa nao pode exceder 255 caracteres.");
        }
    }

    public class UpdateAttendanceCommandHandler : IRequestHandler<UpdateAttendanceCommand, RegistrationResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateAttendanceCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RegistrationResponse> Handle(UpdateAttendanceCommand request, CancellationToken cancellationToken)
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == request.GetId(), cancellationToken);

            if (registration == null)
            {
                throw new NotFoundException("Inscricao nao encontrada");
            }

            registration.Attended = request.Attended;
            registration.Justification = request.Justification;

            _context.Registrations.Update(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}

