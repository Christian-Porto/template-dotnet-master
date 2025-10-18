using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums;

public enum RegistrationStatusEnum
{
    [Description("Registrado")]
    Registered = 0,

    [Description("Não selecionado")]
    NotSelected = 1,

    [Description("Selecionado")]
    Selected = 2
}