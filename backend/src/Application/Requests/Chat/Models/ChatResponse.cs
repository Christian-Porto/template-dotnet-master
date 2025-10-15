namespace ExtensionEventsManager.Core.Application.Requests.Chat.Models;

public class ChatResponse
{
    public int Id { get; set; }
    public int UserAId { get; set; }
    public int UserBId { get; set; }
    public List<ChatMessageResponse> Messages { get; set; } = new();
}

