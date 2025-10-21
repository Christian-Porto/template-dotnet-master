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
            CreateMap<Registration, RegistrationResponse>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.User.Name))
                .ForMember(d => d.Enrollment, opt => opt.MapFrom(s => s.User.Enrollment))
                .ForMember(d => d.Cpf, opt => opt.MapFrom(s => s.User.Cpf))
                .ForMember(d => d.Period, opt => opt.MapFrom(s => s.User.Period));
            CreateMap<CreateRegistrationCommand, Registration>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(_ => DateTime.Now));
        }
    }
}
