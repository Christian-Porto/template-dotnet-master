using AutoMapper;
using ExtensionEventsManager.Core.Application.Requests.Chat.Models;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Mappings;

public class ChatProfile : Profile
{
    public ChatProfile()
    {
        CreateMap<Chat, ChatResponse>();
        CreateMap<ChatMessage, ChatMessageResponse>()
            // Ensure CreatedAtUtc is treated as UTC when mapping to DTO so it serializes with offset (Z)
            .ForMember(d => d.CreatedAtUtc,
                opt => opt.MapFrom(s => new DateTimeOffset(DateTime.SpecifyKind(s.CreatedAtUtc, DateTimeKind.Utc))));
    }
}

