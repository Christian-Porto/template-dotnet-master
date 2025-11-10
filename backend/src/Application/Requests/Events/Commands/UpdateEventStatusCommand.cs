using AutoMapper;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Events.Commands
{
    [Authorize(Permission = new ProfileEnum[] { ProfileEnum.Administrator, ProfileEnum.Monitor })]
    public class UpdateEventStatusCommand : IRequest<EventResponse>
    {
        public int Id { get; set; }
        public bool Status { get; set; }

        public void SetId(int id) => Id = id;
    }

    public class UpdateEventStatusCommandHandler : IRequestHandler<UpdateEventStatusCommand, EventResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateEventStatusCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EventResponse> Handle(UpdateEventStatusCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

            if (entity is null)
            {
                throw new NotFoundException($"Evento com id {request.Id} não foi encontrado.");
            }

            entity.Status = request.Status;

            if (!request.Status)
            {
                await _context.Registrations
                    .Where(r => r.EventId == entity.Id)
                    .ExecuteDeleteAsync(cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return _mapper.Map<EventResponse>(entity);
        }
    }
}
