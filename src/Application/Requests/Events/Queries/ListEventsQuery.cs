using AutoMapper;
using AutoMapper.QueryableExtensions;
using ManagementExtensionActivities.Core.Application.Common.Interfaces;
using ManagementExtensionActivities.Core.Application.Common.Models;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using MediatR;

namespace ManagementExtensionActivities.Core.Application.Requests.Events.Queries
{
    public class ListEventsQuery : QueryRequestBase, IRequest<PaginatedList<EventResponse>>
    {

    }

    public class ListEventsQueryHandler : IRequestHandler<ListEventsQuery, PaginatedList<EventResponse>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ListEventsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedList<EventResponse>> Handle(ListEventsQuery request, CancellationToken cancellationToken)
        {
            var events = _context.Events.ProjectTo<EventResponse>(_mapper.ConfigurationProvider).AsQueryable();

            return await PaginatedList<EventResponse>.CreateAsync(events, request.PageIndex, request.PageSize);
        }
    }
}
