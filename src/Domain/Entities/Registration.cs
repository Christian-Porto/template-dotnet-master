using HealthLab.Core.Domain.Common.Entities;
using HealthLab.Core.Domain.Common.Enums;
using HealthLab.Core.Domain.Exceptions;

namespace HealthLab.Core.Domain.Entities;

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
    
    public Registration(
        User user,
        Event evt,
        DateTime date,
        RegistrationStatus status,
        bool attended = false,
        string? justification = null,
        string? report = null,
        DateTime? reportIncludedAt = null)
    {
        SetUser(user);
        SetEvent(evt);
        SetDate(date);
        SetStatus(status);
        SetAttended(attended);
        SetJustification(justification);
        SetReport(report);
        SetReportIncludedAt(reportIncludedAt);
    }
    
     public void SetUser(User user)
        {
            if (user is null)
                throw new DomainValidationException("O usuário é obrigatório.");
            User = user;
        }

        public void SetEvent(Event evt)
        {
            if (evt is null)
                throw new DomainValidationException("O evento é obrigatório.");
            Event = evt;
        }

        public void SetDate(DateTime date)
        {
            if (date == default) 
                throw new DomainValidationException("A data da inscrição é obrigatória.");
            
            Date = date;
        }

        public void SetStatus(RegistrationStatus status)
        {
            if (!Enum.IsDefined(typeof(RegistrationStatus), status))
                throw new DomainValidationException("Status da inscrição inválido.");
            Status = status;
        }

        public void SetAttended(bool attended)
        {
            Attended = attended;
        }

        public void SetJustification(string? justification)
        {
            Justification = justification is not null && justification.Length > 255
                ? throw new DomainValidationException("A justificativa deve ter no máximo 255 caracteres.")
                : (justification ?? string.Empty).Trim();
        }

        public void SetReport(string? report)
        {
            if (report is not null && report.Length > 255)
                throw new DomainValidationException("O relatório deve ter no máximo 255 caracteres.");
            Report = (report ?? string.Empty).Trim();
        }

        public void SetReportIncludedAt(DateTime? reportIncludedAt)
        {
            ReportIncludedAt = reportIncludedAt;
        }
}