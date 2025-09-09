using HealthLab.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Enums;

namespace ManagementExtensionActivities.Core.Application.Requests.Events.Models
{
    public class EventResponse
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public EventType Type { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Slots { get; set; }
        public Status Status { get; set; }
        public IList<ShiftEnum> Shifts { get; set; } = new List<ShiftEnum>();
    }
}