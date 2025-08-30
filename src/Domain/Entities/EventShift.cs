using HealthLab.Core.Domain.Exceptions;

namespace HealthLab.Core.Domain.Entities;

public class EventShift
{
    public Event Event { get; protected set; }
    public Shift Shift { get; protected set; }
    
    public EventShift(Event evt, Shift shift)
    {
        SetEvent(evt);
        SetShift(shift);
    }

    public void SetEvent(Event evt)
    {
        if (evt is null || evt.Id <= 0)
            throw new DomainValidationException("Evento inválido.");
        Event = evt;
    }

    public void SetShift(Shift shift)
    {
        if (shift is null || shift.Id <= 0)
            throw new DomainValidationException("Turno inválido.");
        Shift = shift;
    }
}