using ManagementExtensionActivities.Core.Domain.Common.Entities;
using ManagementExtensionActivities.Core.Domain.Enums;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Registration : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
    public DateTime Date { get; set; }    // data
    public RegistrationStatus? Status { get; set; } 
    public bool? Attended { get; set; }    // presente (0/1 no banco)
    public string? Justification { get; set; } = string.Empty; // justificativa (<=255)
    public string? Report { get; set; } = string.Empty;        // relatorio (<=255)
    public DateTime? ReportIncludedAt { get; set; }           // datainclusaorelatorio
    
    public Registration() { }
}