using ManagementExtensionActivities.Core.Domain.Entities;
using ManagementExtensionActivities.Core.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ManagementExtensionActivities.Core.Infrastructure.Database.Configurations;

public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
{
    public void Configure(EntityTypeBuilder<Shift> builder)
    {
        builder.ToTable("Shift");

        builder.Property(x => x.Id)
               .UseMySqlIdentityColumn();

        builder.HasIndex(x => x.Name)
               .IsUnique();

        builder.Property(x => x.Name)
               .IsRequired();

        // Seed the three fixed shifts
        builder.HasData(
            new Shift(ShiftEnum.Morning) { Id = 1 },
            new Shift(ShiftEnum.Afternoon) { Id = 2 },
            new Shift(ShiftEnum.Evening) { Id = 3 }
        );
    }
}

