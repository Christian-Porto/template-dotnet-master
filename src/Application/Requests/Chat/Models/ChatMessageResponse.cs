namespace ManagementExtensionActivities.Core.Application.Requests.Chat.Models;

public class ChatMessageResponse
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public int SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

