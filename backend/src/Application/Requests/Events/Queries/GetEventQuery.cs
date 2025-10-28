using AutoMapper;
using AutoMapper.QueryableExtensions;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Events.Queries
{
    public class GetEventQuery : IRequest<EventResponse>
    {
        public int Id { get; set; }
    }

    public class GetEventQueryHandler : IRequestHandler<GetEventQuery, EventResponse>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetEventQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EventResponse> Handle(GetEventQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Events
                .AsNoTracking()
                .Where(e => e.Id == request.Id)
                .ProjectTo<EventResponse>(_mapper.ConfigurationProvider);

            var result = await query.FirstOrDefaultAsync(cancellationToken);

            if (result is null)
            {
                throw new NotFoundException($"Evento com id {request.Id} não foi encontrado.");
            }

            return result;
        }
    }
}

