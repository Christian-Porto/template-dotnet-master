using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Models;
using ExtensionEventsManager.Core.Application.Requests.Auth.Models;
using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ExtensionEventsManager.Core.Application.Requests.Auth.Queries;

public class ListUsersQuery : QueryRequestBase, IRequest<PaginatedList<UserListResponse>>
{
    public string? Name { get; set; }
    public int? Enrollment { get; set; }
    public ProfileEnum? Profile { get; set; }
    public Status? Status { get; set; }
}

public class ListUsersQueryHandler : IRequestHandler<ListUsersQuery, PaginatedList<UserListResponse>>
{
    private readonly IApplicationDbContext _context;

    public ListUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<UserListResponse>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users
            .AsNoTracking()
            .Where(u => u.Profile != ProfileEnum.Administrator)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            var name = request.Name.Trim();
            query = query.Where(u => EF.Functions.Like(u.Name, $"%{name}%"));
        }

        if (request.Enrollment.HasValue)
        {
            const int TOTAL_DIGITS = 9;
            int prefix = request.Enrollment.Value;
            int digits = prefix == 0 ? 1 : (int)Math.Floor(Math.Log10(prefix)) + 1;
            int remaining = Math.Max(0, TOTAL_DIGITS - digits);

            int scale = 1;
            for (int i = 0; i < remaining; i++) scale *= 10;

            int min = prefix * scale;
            int max = min + scale - 1;

            query = query.Where(u => u.Enrollment >= min && u.Enrollment <= max);
        }


        if (request.Profile.HasValue)
        {
            // Even if filtering by Administrator, the base predicate still excludes administrators.
            var profile = request.Profile.Value;
            query = query.Where(u => u.Profile == profile);
        }

        if (request.Status.HasValue)
        {
            var status = request.Status.Value;
            query = query.Where(u => u.Status == status);
        }

        var projected = query.Select(u => new UserListResponse
        {
            Name = u.Name,
            Enrollment = u.Enrollment,
            Profile = u.Profile,
            Status = u.Status
        });

        return await PaginatedList<UserListResponse>.CreateAsync(projected, request.PageIndex, request.PageSize);
    }
}
