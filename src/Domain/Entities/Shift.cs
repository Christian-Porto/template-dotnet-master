using ManagementExtensionActivities.Core.Domain.Common.Entities;
using ManagementExtensionActivities.Core.Domain.Enums;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Shift : BaseEntity
{
    public ShiftEnum Name { get; protected set; }
    public IList<Event> Events { get; protected set; } = new List<Event>();

    public Shift(ShiftEnum name) 
    {
        Name = name;
    }
}