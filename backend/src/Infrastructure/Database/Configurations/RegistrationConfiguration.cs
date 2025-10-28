using ExtensionEventsManager.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExtensionEventsManager.Core.Infrastructure.Database.Configurations;

public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> builder)
    {
        builder.ToTable("Registrations", tb =>
        {
            tb.HasCheckConstraint(
                "CK_Registrations_Status_Enum", "(`Status` IS NULL OR `Status` IN (1, 2, 3))"
            );
        });

        builder.Property(x => x.Id)
               .UseMySqlIdentityColumn()
               .HasComment("Chave primária da inscrição.");

        builder.Property(x => x.Date)
               .IsRequired()
               .HasComment("Data/hora da realização da inscrição.");

        builder.Property(x => x.Justification)
               .HasMaxLength(255)
               .HasComment("Justificativa de ausência (quando o participante não comparece).");

        builder.Property(x => x.Attended)
               .HasComment("Indica presença do participante no evento (true/false).");

        builder.Property(x => x.Status)
               .HasComment("Resultado da seleção do evento para o inscrito (Registered/Selected/NotSelected).");

        builder.HasOne(r => r.User)
               .WithMany()
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Event)
               .WithMany()
               .HasForeignKey(r => r.EventId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
