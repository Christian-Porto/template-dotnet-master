namespace ExtensionEventsManager.Core.Application.Requests.Auth.Models;
public class CodeResponse
{
    public string Code { get; set; }
    public DateTime Expiration { get; set; }
}
