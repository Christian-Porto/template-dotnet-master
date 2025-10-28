using ExtensionEventsManager.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExtensionEventsManager.Core.Infrastructure.Database.Configurations;

public class ChatConfiguration : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.ToTable("Chats");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasComment("Chave primária do chat.");

        builder.HasIndex(x => new { x.UserAId, x.UserBId })
               .IsUnique();

        builder.Property(x => x.UserAId)
               .IsRequired()
               .HasComment("ID do participante A (menor ID do par).");

        builder.Property(x => x.UserBId)
               .IsRequired()
               .HasComment("ID do participante B (maior ID do par).");

        builder.HasMany(x => x.Messages)
               .WithOne()
               .HasForeignKey(m => m.ChatId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

