using AutoMapper;
using ManagementExtensionActivities.Core.Application.Requests.Events.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Events.Models;
using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Mappings
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            CreateMap<Event, EventResponse>();
            CreateMap<CreateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.MapFrom(y => y.Shifts.Select(z => new Shift(z))));
            CreateMap<UpdateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.MapFrom(y => y.Shifts.Select(z => new Shift(z))));
        }
    }
}

