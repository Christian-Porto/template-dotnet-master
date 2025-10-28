using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums;

public enum RegistrationStatusEnum
{
    [Description("Inscrito")]
    Registered = 1,

    [Description("Não selecionado")]
    NotSelected = 2,

    [Description("Selecionado")]
    Selected = 3
}