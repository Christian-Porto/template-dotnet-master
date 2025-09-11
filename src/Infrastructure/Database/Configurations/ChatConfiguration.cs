using ManagementExtensionActivities.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ManagementExtensionActivities.Core.Infrastructure.Database.Configurations;

public class ChatConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.ToTable("Chats");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.UserAId, x.UserBId })
               .IsUnique();

        builder.Property(x => x.UserAId).IsRequired();
        builder.Property(x => x.UserBId).IsRequired();

        builder.HasMany(x => x.Messages)
               .WithOne()
               .HasForeignKey(m => m.ChatId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

