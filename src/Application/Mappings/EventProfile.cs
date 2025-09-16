using AutoMapper;
using ManagementExtensionActivities.Core.Application.Requests.Events.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using ManagementExtensionActivities.Core.Domain.Entities;
using System.Linq;

namespace ManagementExtensionActivities.Core.Application.Mappings
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

