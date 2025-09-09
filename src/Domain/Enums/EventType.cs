using System.ComponentModel;

namespace ManagementExtensionActivities.Core.Domain.Enums;

public enum EventType
{
    [Description("Palestra")]
    Lecture = 1,
    
    [Description("Dinâmica")]
    Dynamic = 2,

    [Description("Prática")]
    Practice = 3
}