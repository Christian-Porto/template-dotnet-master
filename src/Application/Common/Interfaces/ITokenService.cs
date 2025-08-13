using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Application.Common.Interfaces;

public interface ITokenService
{
    string GetToken(User user);
}
