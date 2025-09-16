using FluentValidation;
using MediatR;
using ManagementExtensionActivities.Core.Application.Exceptions;

namespace ManagementExtensionActivities.Core.Application.Common.Behaviours;

public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);

            var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
            var failures = validationResults.SelectMany(r => r.Errors).Where(f => f is not null).ToList();

            if (failures.Count != 0)
            {
                var message = string.Join(" | ", failures.Select(f => f.ErrorMessage));
                throw new BadRequestException(message);
            }
        }

        return await next();
    }
}

