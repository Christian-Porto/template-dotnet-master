using System.ComponentModel;

namespace ManagementExtensionActivities.Core.Domain.Enums;

public enum RegistrationStatusEnum
{
    [Description("Não selecionado")]
    NotSelected = 0,

    [Description("Selecionado")]
    Selected = 1
}