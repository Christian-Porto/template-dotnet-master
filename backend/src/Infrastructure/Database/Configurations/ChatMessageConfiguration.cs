using ExtensionEventsManager.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExtensionEventsManager.Core.Infrastructure.Database.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.ToTable("ChatMessages");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasComment("Chave primária da mensagem de chat.");

        builder.Property(x => x.Content)
               .IsRequired()
               .HasMaxLength(4000)
               .HasComment("Conteúdo textual da mensagem (até 4000 caracteres).");

        builder.Property(x => x.ChatId)
               .IsRequired()
               .HasComment("Chave estrangeira para o chat ao qual a mensagem pertence.");

        builder.Property(x => x.CreatedAtUtc)
               .IsRequired()
               .HasComment("Data/hora (UTC) em que a mensagem foi criada.");

        builder.Property(x => x.SenderId)
               .IsRequired()
               .HasComment("ID do usuário remetente da mensagem.");
    }
}

