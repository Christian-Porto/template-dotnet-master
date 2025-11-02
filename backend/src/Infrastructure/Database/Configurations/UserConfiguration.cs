using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ExtensionEventsManager.Core.Domain.Entities;

namespace ExtensionEventsManager.Core.Infrastructure.Database;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users", tb =>
        {
            // Status enum in domain: Inactive = 0, Active = 1
            tb.HasCheckConstraint("CK_Users_Status_Enum", "`Status`  IN (0, 1)");
            tb.HasCheckConstraint("CK_Users_Profile_Enum", "`Profile` IN (1, 2, 3)");
        });

        builder.Property(x => x.Id)
            .UseMySqlIdentityColumn()
            .HasComment("Chave primária do usuário.");

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256)
            .HasComment("Nome do usuário.");

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(256)
            .HasComment("Email do usuário.");

        builder.Property(x => x.Password)
            .IsRequired()
            .HasMaxLength(256)
            .HasComment("Senha do usuário, armazenada de forma hash.");

        builder.Property(x => x.Enrollment)
            .HasComment("Matrícula do aluno (número institucional).");

        builder.Property(x => x.Period)
            .HasComment("Período atual do aluno (1 a 10).");

        builder.Property(x => x.Cpf)
            .HasMaxLength(11)
            .HasComment("CPF do usuário.");

        builder.Property(x => x.Status)
            .IsRequired()
            .HasComment("Status de conta do usuário (Active/Inactive).");

        builder.Property(x => x.Profile)
            .IsRequired()
            .HasComment("Perfil do usuário (Administrator/Monitor/Student).");

        builder.Property(x => x.ResetPasswordToken)
            .IsRequired()
            .HasMaxLength(256)
            .HasComment("Token de redefinição de senha.");

        builder.Property(x => x.ResetPasswordTokenExpiration)
            .IsRequired()
            .HasComment("Expiração do token de redefinição de senha.");

        builder.HasIndex(x => x.Email).IsUnique();
        builder.HasIndex(x => x.Enrollment).IsUnique();
        builder.HasIndex(x => x.Cpf).IsUnique();
    }
}
