using HealthLab.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthLab.Core.Infrastructure.Database.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        // PK
        builder.Property(x => x.Id)
            .UseMySqlIdentityColumn();

        // Campos
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(2056);

        builder.Property(x => x.EventDate)
            .IsRequired()
            .IsRequired();

        builder.Property(x => x.StartDate)
            .IsRequired()
            .IsRequired();

        builder.Property(x => x.EndDate)
            .IsRequired();

        builder.Property(x => x.Slots)
            .IsRequired();

        // Enums gravados como INT
        builder.Property(x => x.Type)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.Status)
            .HasConversion<int>()
            .IsRequired();

        // Índices úteis (opcional, mas recomendável)
        builder.HasIndex(x => x.EventDate).HasDatabaseName("IX_evento_dataevento");
        builder.HasIndex(x => new { x.StartDate, x.EndDate }).HasDatabaseName("IX_evento_periodo");

        // Regras reforçadas no banco
        builder.HasCheckConstraint("CK_evento_EndDate_StartDate", "datafim >= datainicio");
        builder.HasCheckConstraint("CK_evento_EventDate_EndDate", "dataevento >= datafim");
    }
}