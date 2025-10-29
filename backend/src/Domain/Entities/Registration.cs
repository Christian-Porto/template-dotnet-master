using ExtensionEventsManager.Core.Domain.Common.Entities;
using ExtensionEventsManager.Core.Domain.Enums;

namespace ExtensionEventsManager.Core.Domain.Entities;

public class Registration : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
    public DateTime Date { get; set; }
    public RegistrationStatusEnum? Status { get; set; } 
    public bool? Attended { get; set; }
    public string? Justification { get; set; } = string.Empty;
    
    private Registration() { }
}
