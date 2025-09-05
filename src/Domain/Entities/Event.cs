using HealthLab.Core.Domain.Common.Entities;
using HealthLab.Core.Domain.Common.Enums;
using HealthLab.Core.Domain.Exceptions;

namespace HealthLab.Core.Domain.Entities;

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
    public List<EventShift>  Shifts  { get; protected set; }
    
    public Event(string name, EventType type, string description, DateTime eventDate,
        DateTime startDate, DateTime endDate, int slots, Status status)
    {
        SetName(name);
        SetType(type);
        SetDescription(description);
        SetStartDate(startDate);
        SetEndDate(endDate);
        SetEventDate(eventDate);
        SetSlots(slots);
        SetStatus(status);
    }
    
    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainValidationException("O Nome do evento é obrigatório.");

        if (name.Length > 255)
            throw new DomainValidationException("O nome do evento deve ter no máximo 255 caracteres.");

        Name = name.Trim();
    }

    public void SetType(EventType type)
    {
        if (!Enum.IsDefined(typeof(EventType), type))
            throw new DomainValidationException("O Tipo  de vento inválido.");
            
        Type = type;
    }

    public void SetDescription(string description)
    {
        if (description != null && description.Length > 2056)
            throw new DomainValidationException("A descrição do evento deve ter no máximo 2056 caracteres.");

        Description = description?.Trim() ?? string.Empty;
    }

    public void SetEventDate(DateTime eventDate)
    {
        if (eventDate == default)
            throw new DomainValidationException("A data do evento é obrigatória.");
        
        // Verifica se já existe um EndDate definido e se o EventDate é menor que ele
        if (EndDate != default && eventDate < EndDate)
            throw new DomainValidationException("A data do evento não pode ser anterior à data de fim das inscrições.");
            
        EventDate = eventDate;
    }

    public void SetStartDate(DateTime startDate)
    {
        if (startDate == default)
            throw new DomainValidationException("A data de iníco das inscrições é obrigatória.");
        
        StartDate = startDate;
    }

    public void SetEndDate(DateTime endDate)
    {
        if (StartDate != default && endDate < StartDate)
            throw new DomainValidationException("A data de fim das inscrições é obrigatória.");
        
        // Verifica se já existe um EventDate definido e se o EndDate é maior que ele
        if (EventDate != default && endDate > EventDate)
            throw new DomainValidationException("A data de fim das inscrições não pode ser posterior à data do evento.");
            
        EndDate = endDate;
    }

    public void SetSlots(int slots)
    {
        if (slots < 0)
            throw new DomainValidationException("A quantidade de vagas não pode ser negativa.");
            
        Slots = slots;
    }

    public void SetStatus(Status status)
    {
        if (!Enum.IsDefined(typeof(Status), status))
            throw new DomainValidationException("Status inválido.");
            
        Status = status;
    }
}