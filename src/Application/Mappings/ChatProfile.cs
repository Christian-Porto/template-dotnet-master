using AutoMapper;
using ManagementExtensionActivities.Core.Application.Requests.Chat.Models;
using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Mappings;

public class ChatProfile : Profile
{
    public ChatProfile()
    {
        CreateMap<Chat, ChatResponse>();
        CreateMap<ChatMessage, ChatMessageResponse>();
    }
}

