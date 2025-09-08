using HealthLab.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Common.Entities;
using ManagementExtensionActivities.Core.Domain.Common.Enums;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Event : BaseEntity
{
    public string Name { get; protected set; }
    public EventType Type { get; protected set; }
    public string Description { get; protected set; }
    public DateTime EventDate { get; protected set; }
    public DateTime StartDate { get; protected set; }
    public DateTime EndDate { get; protected set; }
    public int Slots { get; protected set; }
    public Status Status { get; protected set; }
    public IList<Shift> Shifts { get; protected set; } = new List<Shift>();

    public Event() { }
}