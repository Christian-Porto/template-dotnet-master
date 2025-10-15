namespace ExtensionEventsManager.Core.Domain.Exceptions;

public class DomainValidationException : Exception
{
    public DomainValidationException() : base()
    {
    }

    public DomainValidationException(string message) : base(message)
    {
    }
}
