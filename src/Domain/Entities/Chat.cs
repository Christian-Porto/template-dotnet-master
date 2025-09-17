using ExtensionEventsManager.Core.Domain.Common.Entities;

namespace ExtensionEventsManager.Core.Domain.Entities;

public class Chat : BaseEntity
{
    public int UserAId { get; private set; }
    public int UserBId { get; private set; }

    public ICollection<ChatMessage> Messages { get; private set; } = new List<ChatMessage>();

    // Aplicar ordena��o para garantir par �nico (m�n./m�x.)
    public Chat(int user1Id, int user2Id)
    {
        if (user1Id == user2Id) throw new ArgumentException("O bate-papo deve ser entre dois usu�rios diferentes");

        UserAId = Math.Min(user1Id, user2Id);
        UserBId = Math.Max(user1Id, user2Id);
    }

    // EF Core
    private Chat() { }

    public bool HasParticipant(int userId) => UserAId == userId || UserBId == userId;

    public ChatMessage AddMessage(int senderId, string content)
    {
        if (!HasParticipant(senderId)) throw new InvalidOperationException("O remetente n�o pertence a este chat");
        var message = new ChatMessage(Id, senderId, content);
        Messages.Add(message);
        return message;
    }
}

