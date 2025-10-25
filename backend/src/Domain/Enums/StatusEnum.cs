using System.ComponentModel;

namespace ExtensionEventsManager.Core.Domain.Enums
{
    public enum StatusEnum
    {
        [Description("Inscrições não Iniciadas")]
            RegistrationNotStarted = 1,

        [Description("Inscrições Abertas")]
            OpenForRegistration = 2,
    
        [Description("Inscrições Encerradas")]
            RegistrationClosed = 3
    }
}
