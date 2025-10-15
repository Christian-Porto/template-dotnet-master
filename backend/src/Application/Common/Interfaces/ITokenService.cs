using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Common.Interfaces;

public interface ITokenService
{
    string GetToken(User user);
}
