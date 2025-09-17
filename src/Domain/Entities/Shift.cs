using ExtensionEventsManager.Core.Domain.Common.Entities;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Domain.Entities;

public class Shift : BaseEntity
{
    public ShiftEnum Name { get; set; }
    public IList<Event> Events { get; set; } = new List<Event>();

    public Shift(ShiftEnum name) 
    {
        Name = name;
    }
}