using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Entities;
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

            var registration = _mapper.Map<Registration>(request);

            await _context.Registrations.AddAsync(registration);
            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<RegistrationResponse>(registration);
        }
    }
}
