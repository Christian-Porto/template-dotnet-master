using HealthLab.Core.Domain.Common.Enums;
using ManagementExtensionActivities.Core.Domain.Common.Entities;

namespace ManagementExtensionActivities.Core.Domain.Entities;

public class Registration : BaseEntity
{
    public User User { get; private set; }       // usuario_id
    public Event Event { get; private set; }      // evento_id
    public DateTime Date { get; private set; }    // data
    public RegistrationStatus Status { get; private set; } 
    public bool Attended { get; private set; }    // presente (0/1 no banco)
    public string Justification { get; private set; } = string.Empty; // justificativa (<=255)
    public string Report { get; private set; } = string.Empty;        // relatorio (<=255)
    public DateTime? ReportIncludedAt { get; private set; }           // datainclusaorelatorio
    
    public Registration() { }
}