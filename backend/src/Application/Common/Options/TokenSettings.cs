namespace ExtensionEventsManager.Core.Application.Common.Options;
public class TokenSettings
{
    public string SecurityKey { get; set; }

    public string Audience { get; set; }
    public string Issuer { get; set; }

    public int ExpiringTimeInHours { get; set; }
}
