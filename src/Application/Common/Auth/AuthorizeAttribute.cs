using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Common.Auth;


[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public class AuthorizeAttribute : Attribute
{
    public AuthorizeAttribute() { }
    public ProfileEnum[] Permission { get; set; } = new ProfileEnum[0];
}
