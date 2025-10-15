using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Application.Requests.Registrations.Models
{
    public class RegistrationResponse
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public RegistrationStatusEnum? Status { get; set; }
        public bool? Attended { get; set; }
        public string? Justification { get; set; }
        public int ParticipationsCount { get; set; }
    }
}
