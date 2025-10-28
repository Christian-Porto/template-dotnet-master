using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Events.Models
{
    public class EventResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public EventTypeEnum Type { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Slots { get; set; }
        public bool Status { get; set; }
        public StatusEnum RegistrationStatus { get; set; }
        public IList<ShiftEnum> Shifts { get; set; } = new List<ShiftEnum>();
    }
}
