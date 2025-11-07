namespace ExtensionEventsManager.Core.Application.Requests.Chat.Models;

public class ChatMessageResponse
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public int SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    // Use DateTimeOffset to preserve UTC offset information in serialization
    public DateTimeOffset CreatedAtUtc { get; set; }
}

