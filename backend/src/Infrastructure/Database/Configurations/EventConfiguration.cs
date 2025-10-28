using ExtensionEventsManager.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExtensionEventsManager.Core.Infrastructure.Database.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("Events", tb =>
        {
            tb.HasCheckConstraint("CK_Events_Type_Enum", "`Type` IN (1, 2, 3)");
        });

        builder.Property(x => x.Id)
               .UseMySqlIdentityColumn()
               .HasComment("Chave primária do evento.");

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(255)
               .HasComment("Nome do evento.");

        builder.Property(x => x.Description)
               .IsRequired()
               .HasMaxLength(2056)
               .HasComment("Descrição do evento.");

        builder.Property(x => x.Type)
               .IsRequired()
               .HasComment("Tipo do evento (Lecture/Dynamic/Practice).");

        builder.Property(x => x.EventDate)
               .IsRequired()
               .HasComment("Data de realização do evento.");

        builder.Property(x => x.StartDate)
               .IsRequired()
               .HasComment("Data de início das inscrições.");

        builder.Property(x => x.EndDate)
               .IsRequired()
               .HasComment("Data de término das inscrições.");

        builder.Property(x => x.Slots)
               .IsRequired()
               .HasComment("Quantidade de vagas disponíveis para inscrição.");

        builder.Property(x => x.Status)
               .IsRequired()
               .HasDefaultValue(true)
               .HasComment("Indica se o evento está ativo (true) ou cancelado (false).");

        builder.HasMany(e => e.Shifts)
               .WithMany(s => s.Events);
    }
}
