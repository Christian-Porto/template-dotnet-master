using AutoMapper;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Mappings;

public class ChatProfile : Profile
{
    public ChatProfile()
    {
        CreateMap<Chat, ChatResponse>();
        CreateMap<ChatMessage, ChatMessageResponse>();
    }
}

