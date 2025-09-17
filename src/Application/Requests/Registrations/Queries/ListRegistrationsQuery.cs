using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Queries
{
    public class ListRegistrationsQuery : QueryRequestBase, IRequest<PaginatedList<RegistrationResponse>>
    {
        public RegistrationStatusEnum? Status { get; set; }
        public bool? Attended { get; set; }
    }

    public class ListRegistrationsQueryHandler : IRequestHandler<ListRegistrationsQuery, PaginatedList<RegistrationResponse>>
    {
        private readonly IApplicationDbContext _context;

        public ListRegistrationsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedList<RegistrationResponse>> Handle(ListRegistrationsQuery request, CancellationToken cancellationToken)
        {
            var registrations = _context.Registrations
                .AsNoTracking()
                .AsQueryable();

            if (request.Status.HasValue)
            {
                registrations = registrations.Where(r => r.Status == request.Status);
            }

            if (request.Attended.HasValue)
            {
                registrations = registrations.Where(r => r.Attended == request.Attended);
            }

            var query = registrations
                .Select(r => new RegistrationResponse
                {
                    Id = r.Id,
                    Date = r.Date,
                    Status = r.Status,
                    Attended = r.Attended,
                    Justification = r.Justification,
                    ParticipationsCount = _context.Registrations.Count(rr => rr.UserId == r.UserId && rr.Attended == true)
                });

            return await PaginatedList<RegistrationResponse>.CreateAsync(query, request.PageIndex, request.PageSize);
        }
    }
}

