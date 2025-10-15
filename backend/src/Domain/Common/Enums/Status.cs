using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Common.Enums;
public enum Status
{
    [Description("Inactive")]
    Inactive = 0,

    [Description("Active")]
    Active = 1,
}
