using ManagementExtensionActivities.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ManagementExtensionActivities.Core.Infrastructure.Database.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("Events");

        builder.Property(x => x.Id)
               .UseMySqlIdentityColumn();

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(255);

        builder.Property(x => x.Description)
               .IsRequired()
               .HasMaxLength(2056);

        builder.Property(x => x.EventDate).IsRequired();
        builder.Property(x => x.StartDate).IsRequired();
        builder.Property(x => x.EndDate).IsRequired();
        builder.Property(x => x.Slots).IsRequired();

        // Many-to-many with Shift uses EF Core conventions (join table EventShift)
        builder
            .HasMany(e => e.Shifts)
            .WithMany(s => s.Events);
    }
}

