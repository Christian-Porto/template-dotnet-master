using System.ComponentModel;

namespace ManagementExtensionActivities.Core.Domain.Enums;

public enum RegistrationStatus
{
    [Description("Não selecionado")]
    NotSelected = 0,

    [Description("Selecionado")]
    Selected = 1
}