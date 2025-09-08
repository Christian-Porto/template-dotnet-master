using Microsoft.EntityFrameworkCore;
using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
