using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Infrastructure.Database;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .Property(x => x.Id)
            .UseMySqlIdentityColumn();

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);

        builder
            .Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder
            .Property(x => x.Password)
            .IsRequired()
            .HasMaxLength(256);

        builder
            .Property(x => x.Enrollment)
            .IsRequired();

        builder
            .Property(x => x.Period)
            .IsRequired();

        builder
            .Property(x => x.Cpf)
            .IsRequired();

        builder.Property(x => x.Status)
            .HasConversion(new EnumToStringConverter<Status>())
            .HasMaxLength(16);

        builder.HasIndex(x => x.Email).IsUnique();
    }
}
