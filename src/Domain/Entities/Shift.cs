using HealthLab.Core.Domain.Common.Entities;
using HealthLab.Core.Domain.Exceptions;

namespace HealthLab.Core.Domain.Entities;

public class Shift : BaseEntity
{
    public string Name { get; protected set; }
    
    public Shift(string name)
    {
        SetName(name);
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainValidationException("O turno do evento é obrigatório.");

        if (name.Length > 100)
            throw new DomainValidationException("O nome do turno deve ter no máximo 100 caracteres.");

        Name = name.Trim();
    }

}