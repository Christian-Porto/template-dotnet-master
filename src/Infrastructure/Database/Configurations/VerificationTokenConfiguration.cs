using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HealthLab.Core.Domain.Entities;

namespace HealthLab.Core.Infrastructure.Database.Configurations;
public class VerificationTokenConfiguration : IEntityTypeConfiguration<VerificationToken>
{
    public void Configure(EntityTypeBuilder<VerificationToken> builder)
    {
        builder
            .Property(x => x.Id)
            .UseMySqlIdentityColumn();

        builder
            .Property(x => x.Token)
            .IsRequired()
            .HasMaxLength(6);

        builder.Property(x => x.Expiration)
            .IsRequired();

    }
}
