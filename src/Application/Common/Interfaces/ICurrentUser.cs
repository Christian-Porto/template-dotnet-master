using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Application.Common.Interfaces;
public interface ICurrentUser
{
    int? Id { get; }
    string? Email { get; }
    string? Name { get; }
}
