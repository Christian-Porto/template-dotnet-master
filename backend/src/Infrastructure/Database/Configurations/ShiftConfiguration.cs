using ExtensionEventsManager.Core.Domain.Entities;
using ExtensionEventsManager.Core.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExtensionEventsManager.Core.Infrastructure.Database.Configurations;

public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
{
    public void Configure(EntityTypeBuilder<Shift> builder)
    {
        builder.ToTable("Shift", tb =>
        {
            tb.HasCheckConstraint("CK_Shift_Name_Enum", "`Name` IN (1, 2, 3)");
        });

        builder.Property(x => x.Id)
               .UseMySqlIdentityColumn()
               .HasComment("Chave primária do turno.");

        builder.HasIndex(x => x.Name).IsUnique();

        builder.Property(x => x.Name)
               .IsRequired()
               .HasComment("Enum do turno (Morning/Afternoon/Evening).");

        builder.HasData(
            new Shift(ShiftEnum.Morning) { Id = 1 },
            new Shift(ShiftEnum.Afternoon) { Id = 2 },
            new Shift(ShiftEnum.Evening) { Id = 3 }
        );
    }
}
