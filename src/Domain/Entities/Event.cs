using ManagementExtensionActivities.Core.Domain.Common.Entities;
using ManagementExtensionActivities.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Enums;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Event : BaseEntity
{
    public string Name { get; set; }
    public EventTypeEnum Type { get; set; }
    public string Description { get; set; }
    public DateTime EventDate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Slots { get; set; }
    public Status Status { get; set; }
    public IList<Shift> Shifts { get; set; } = new List<Shift>();

    private Event() { }
}