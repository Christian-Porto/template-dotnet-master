using AutoMapper;
using ExtensionEventsManager.Core.Application.Requests.Events.Commands;
using ExtensionEventsManager.Core.Application.Requests.Events.Models;
using ExtensionEventsManager.Core.Domain.Entities;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Mappings
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            CreateMap<Event, EventResponse>()
                .ForMember(d => d.Shifts, opt => opt.MapFrom(s => s.Shifts.Select(x => x.Name)))
                .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status))
                .ForMember(d => d.RegistrationStatus, opt => opt.MapFrom(s =>
                    s.StartDate.Date > DateTime.Today
                        ? StatusEnum.RegistrationNotStarted
                        : (s.EndDate.Date < DateTime.Today
                            ? StatusEnum.RegistrationClosed
                            : StatusEnum.OpenForRegistration)));

            CreateMap<CreateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.Ignore());

            CreateMap<UpdateEventCommand, Event>()
                .ForMember(x => x.Shifts, opt => opt.Ignore());
        }
    }
}

