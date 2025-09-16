using AutoMapper;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Commands;
using ManagementExtensionActivities.Core.Application.Requests.Registrations.Models;
using ManagementExtensionActivities.Core.Domain.Entities;

namespace ManagementExtensionActivities.Core.Application.Mappings
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
