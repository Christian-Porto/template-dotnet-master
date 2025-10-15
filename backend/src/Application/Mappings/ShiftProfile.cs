using AutoMapper;
using ExtensionEventsManager.Core.Domain.Entities;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Mappings
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
