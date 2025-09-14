using AutoMapper;
using ManagementExtensionActivities.Core.Domain.Entities;
using ManagementExtensionActivities.Core.Domain.Enums;

namespace ManagementExtensionActivities.Core.Application.Mappings
{
    public class ShiftProfile : Profile
    {
        public ShiftProfile()
        {
            CreateMap<Shift, ShiftEnum>()
                .ConvertUsing(s => s.Name);
        }
    }
}
