using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Application.Common.Interfaces;

public interface IEventRepository
{
    Task AddAsync(Event entity, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}