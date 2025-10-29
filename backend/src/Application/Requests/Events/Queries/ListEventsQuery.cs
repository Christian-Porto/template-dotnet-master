using AutoMapper;
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
        public DateTime[]? EventDate { get; set; }
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
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);

                switch (request.Status.Value)
                {
                    case StatusEnum.RegistrationNotStarted:
                        // Start date strictly after today (i.e., on or after tomorrow)
                        query = query.Where(e => e.StartDate >= tomorrow);
                        break;
                    case StatusEnum.OpenForRegistration:
                        // Start date before tomorrow AND end date on/after today
                        query = query.Where(e => e.StartDate < tomorrow && e.EndDate >= today);
                        break;
                    case StatusEnum.RegistrationClosed:
                        // End date strictly before today
                        query = query.Where(e => e.EndDate < today);
                        break;
                }
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var name = request.Name.Trim();
                query = query.Where(e => EF.Functions.Like(e.Name, $"%{name}%"));
            }

            // Filter by event occurrence date (EventDate)
            if (request.EventDate != null && request.EventDate.Length > 0)
            {
                if (request.EventDate.Length == 1)
                {
                    var d = request.EventDate[0].Date;
                    var next = d.AddDays(1);
                    query = query.Where(e => e.EventDate >= d && e.EventDate < next);
                }
                else
                {
                    var start = request.EventDate.Min().Date;
                    var end = request.EventDate.Max().Date.AddDays(1); // exclusive upper bound
                    query = query.Where(e => e.EventDate >= start && e.EventDate < end);
                }
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
                            // Only registrations still in 'Registered' state for current user
                            query = query.Where(e =>
                                _context.Registrations.Any(r =>
                                    r.EventId == e.Id &&
                                    r.UserId == uid &&
                                    r.Status == RegistrationStatusEnum.Registered));
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

            var tdy = DateTime.Today;
            var tmr = tdy.AddDays(1);
            var projected = query.Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
                Type = e.Type,
                Description = e.Description,
                EventDate = e.EventDate,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Slots = e.Slots,
                Status = e.Status,
                RegistrationStatus = e.StartDate >= tmr
                    ? StatusEnum.RegistrationNotStarted
                    : (e.EndDate < tdy
                        ? StatusEnum.RegistrationClosed
                        : StatusEnum.OpenForRegistration),
                Shifts = e.Shifts.Select(x => x.Name).ToList()
            });

            return await PaginatedList<EventResponse>.CreateAsync(projected, request.PageIndex, request.PageSize);
        }
    }
}
