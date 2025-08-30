using System.ComponentModel;

namespace HealthLab.Core.Domain.Common.Enums;

public enum EventType
{
    [Description("Palestra")]
    Lecture = 1,
    
    [Description("Dinâmica")]
    Dynamic = 2,

    [Description("Prática")]
    Practice = 3
}