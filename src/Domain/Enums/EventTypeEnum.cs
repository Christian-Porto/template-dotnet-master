using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums;

public enum EventTypeEnum
{
    [Description("Palestra")]
    Lecture = 1,
    
    [Description("Dinâmica")]
    Dynamic = 2,

    [Description("Prática")]
    Practice = 3
}