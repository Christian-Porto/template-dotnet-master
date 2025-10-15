using AutoMapper;
using ExtensionEventsManager.Core.Application.Requests.Events.Commands;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using System.Linq;

namespace ExtensionEventsManager.Core.Application.Mappings
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            CreateMap<Event, EventResponse>()
                .ForMember(d => d.Shifts, opt => opt.MapFrom(s => s.Shifts.Select(x => x.Name)));

            CreateMap<CreateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.Ignore());

            CreateMap<UpdateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.Ignore());
        }
    }
}

