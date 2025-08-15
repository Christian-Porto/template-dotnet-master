using System.ComponentModel;

namespace ManagementExtensionActivities.Core.Domain.Common.Enums;
public enum Status
{
    [Description("Inactive")]
    Inactive = 0,

    [Description("Active")]
    Active = 1,
}
