using AutoMapper;
using AutoMapper.QueryableExtensions;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Events.Queries
{
    public class ListEventsQuery : QueryRequestBase, IRequest<PaginatedList<EventResponse>>
    {
        public EventTypeEnum? Type { get; set; }
        public StatusEnum? Status { get; set; }
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public RegistrationStatusEnum? RegistrationStatus { get; set; }

        // Presença do usuário atual no evento (true/false)
        public bool? Attended { get; set; }
    }

    public class ListEventsQueryHandler : IRequestHandler<ListEventsQuery, PaginatedList<EventResponse>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUser _currentUser;
        private readonly IMapper _mapper;

        public ListEventsQueryHandler(IApplicationDbContext context, ICurrentUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<PaginatedList<EventResponse>> Handle(ListEventsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Events
                .AsNoTracking()
                .AsQueryable();

            if (request.Type.HasValue)
            {
                query = query.Where(e => e.Type == request.Type.Value);
            }

            if (request.Status.HasValue)
            {
                query = query.Where(e => e.Status == request.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var name = request.Name.Trim();
                query = query.Where(e => EF.Functions.Like(e.Name, $"%{name}%"));
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(e => e.StartDate >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(e => e.EndDate <= request.EndDate.Value);
            }

            var me = _currentUser.Id;

            if (request.RegistrationStatus.HasValue)
            {
                if (!me.HasValue)
                {
                    query = query.Where(_ => false);
                }
                else
                {
                    var uid = me.Value;

                    switch (request.RegistrationStatus.Value)
                    {
                        case RegistrationStatusEnum.Registered:
                            // Any registration by the current user, regardless of selection outcome
                            query = query.Where(e =>
                                _context.Registrations.Any(r =>
                                    r.EventId == e.Id &&
                                    r.UserId == uid));
                            break;

                        case RegistrationStatusEnum.NotSelected:
                            query = query.Where(e =>
                                _context.Registrations.Any(r =>
                                    r.EventId == e.Id &&
                                    r.UserId == uid &&
                                    r.Status == RegistrationStatusEnum.NotSelected));
                            break;

                        case RegistrationStatusEnum.Selected:
                            query = query.Where(e =>
                                _context.Registrations.Any(r =>
                                    r.EventId == e.Id &&
                                    r.UserId == uid &&
                                    r.Status == RegistrationStatusEnum.Selected));
                            break;
                    }
                }
            }

            if (request.Attended.HasValue)
            {
                if (!me.HasValue)
                {
                    query = query.Where(e => false);
                }
                else
                {
                    var uid = me.Value;
                    var attended = request.Attended.Value;
                    query = query.Where(e => _context.Registrations.Any(r => r.EventId == e.Id && r.UserId == uid && r.Attended == attended));
                }
            }

            var projected = query.ProjectTo<EventResponse>(_mapper.ConfigurationProvider);

            return await PaginatedList<EventResponse>.CreateAsync(projected, request.PageIndex, request.PageSize);
        }
    }
}
