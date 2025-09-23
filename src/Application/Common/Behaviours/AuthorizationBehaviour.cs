using ExtensionEventsManager.Core.Application.Common.Auth;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Exceptions;
using MediatR;
using System.Reflection;

namespace ExtensionEventsManager.Core.Application.Common.Behaviours;

public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ICurrentUser _currentUser;
    public AuthorizationBehaviour(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (authorizeAttributes.Any())
        {
            if (!_currentUser.Id.HasValue)
            {
                throw new UnauthorizedAccessException();
            }

            foreach (var authorize in authorizeAttributes)
            {
                if (authorize.Permission.Length > 0)
                {
                    if (!authorize.Permission.Contains(_currentUser.Profile))
                    {
                        throw new ForbiddenAccessException();
                    }
                }
            }
        }

        return await next();
    }
}
