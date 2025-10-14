using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Chat.Models;

public class ChatUserResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ProfileEnum Profile { get; set; }
}

