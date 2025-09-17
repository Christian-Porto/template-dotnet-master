using AutoMapper;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Commands;
using ExtensionEventsManager.Core.Application.Requests.Registrations.Models;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Application.Mappings
{
    public class RegistrationProfile : Profile
    {
        public RegistrationProfile() 
        {
            CreateMap<Registration, RegistrationResponse>();
            CreateMap<CreateRegistrationCommand, Registration>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(_ => DateTime.Now));
            CreateMap<UpdateRegistrationCommand, Registration>();
        }
    }
}
