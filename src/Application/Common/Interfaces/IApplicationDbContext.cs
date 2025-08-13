using Microsoft.EntityFrameworkCore;
using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    public DbSet<User> Users { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
