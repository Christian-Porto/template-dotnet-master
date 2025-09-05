using System.ComponentModel;

namespace HealthLab.Core.Domain.Common.Enums;

public enum RegistrationStatus
{
    [Description("Não selecionado")]
    NotSelected = 0,

    [Description("Selecionado")]
    Selected = 1
}