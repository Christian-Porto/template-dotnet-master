using System.ComponentModel;

namespace ManagementExtensionActivities.Core.Domain.Enums
{
    public enum ShiftEnum
    {
        [Description("Matutino")]
        Morning = 1,
        [Description("Vespertino")]
        Afternoon = 2,
        [Description("Noturno")]
        Evening = 3
    }
}
