using ManagementExtensionActivities.Core.Domain.Common.Entities;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Chat : BaseEntity
{
    public int UserAId { get; private set; }
    public int UserBId { get; private set; }

    public ICollection<ChatMessage> Messages { get; private set; } = new List<ChatMessage>();

    // Enforce ordering to guarantee unique pair (min/max)
    public Chat(int user1Id, int user2Id)
    {
        if (user1Id == user2Id) throw new ArgumentException("Chat must be between two different users");

        UserAId = Math.Min(user1Id, user2Id);
        UserBId = Math.Max(user1Id, user2Id);
    }

    // EF Core
    private Chat() { }

    public bool HasParticipant(int userId) => UserAId == userId || UserBId == userId;

    public ChatMessage AddMessage(int senderId, string content)
    {
        if (!HasParticipant(senderId)) throw new InvalidOperationException("Sender does not belong to this chat");
        var message = new ChatMessage(Id, senderId, content);
        Messages.Add(message);
        return message;
    }
}

