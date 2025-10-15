using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums
{
    public enum StatusEnum
    {
        [Description("Inscrições Abertas")]
            OpenForRegistration = 1,
    
        [Description("Insrições Encerradas")]
            RegistrationClosed = 2,

        [Description("Concluído")]
            Completed = 3,

        [Description("Em Andamento")]
            InProgress = 4
    }
}
