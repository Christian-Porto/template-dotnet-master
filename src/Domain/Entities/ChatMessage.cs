using ExtensionEventsManager.Core.Domain.Common.Entities;

namespace ExtensionEventsManager.Core.Domain.Entities;

public class ChatMessage : BaseEntity
{
    public int ChatId { get; private set; }
    public int SenderId { get; private set; }
    public string Content { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    public ChatMessage(int chatId, int senderId, string content)
    {
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("O conte�do da mensagem n�o pode estar vazio");
        ChatId = chatId;
        SenderId = senderId;
        Content = content.Trim();
        CreatedAtUtc = DateTime.UtcNow;
    }

    // EF Core
    private ChatMessage() { }
}

