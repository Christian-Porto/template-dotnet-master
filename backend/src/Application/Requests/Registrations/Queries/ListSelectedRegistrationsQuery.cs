using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Queries
{
    public class ListSelectedRegistrationsQuery : QueryRequestBase, IRequest<PaginatedList<RegistrationResponse>>
    {
        public int EventId { get; set; }
    }

    public class ListSelectedRegistrationsQueryHandler : IRequestHandler<ListSelectedRegistrationsQuery, PaginatedList<RegistrationResponse>>
    {
        private readonly IApplicationDbContext _context;

        public ListSelectedRegistrationsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedList<RegistrationResponse>> Handle(ListSelectedRegistrationsQuery request, CancellationToken cancellationToken)
        {
            var registrations = _context.Registrations
                .AsNoTracking()
                .AsQueryable();

            registrations = registrations.Where(r => r.EventId == request.EventId && r.Status == RegistrationStatusEnum.Selected);

            var query = registrations
                .Select(r => new RegistrationResponse
                {
                    Id = r.Id,
                    Date = r.Date,
                    Status = r.Status,
                    Attended = r.Attended,
                    Justification = r.Justification,
                    Name = r.User.Name,
                    Enrollment = r.User.Enrollment,
                    Cpf = r.User.Cpf,
                    Period = r.User.Period,
                    ParticipationsCount = _context.Registrations.Count(rr => rr.UserId == r.UserId && rr.Attended == true && rr.Status == RegistrationStatusEnum.Selected)
                });

            return await PaginatedList<RegistrationResponse>.CreateAsync(query, request.PageIndex, request.PageSize);
        }
    }
}

