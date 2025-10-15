using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums;

public enum ProfileEnum
{
    [Description("Administrador")]
    Administrator = 1,
    
    [Description("Monitor")]
    Monitor = 2,

    [Description("Aluno")]
    Student = 3
}