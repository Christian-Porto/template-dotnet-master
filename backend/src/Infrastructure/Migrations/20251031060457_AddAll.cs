using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ExtensionEventsManager.Core.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAll : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Chats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária do chat.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserAId = table.Column<int>(type: "int", nullable: false, comment: "ID do participante A (menor ID do par)."),
                    UserBId = table.Column<int>(type: "int", nullable: false, comment: "ID do participante B (maior ID do par).")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chats", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária do evento.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(512)", maxLength: 512, nullable: false, comment: "Nome do evento.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: false, comment: "Tipo do evento (Lecture/Dynamic/Practice)."),
                    Description = table.Column<string>(type: "varchar(8224)", maxLength: 8224, nullable: false, comment: "Descrição do evento.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EventDate = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Data de realização do evento."),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Data de início das inscrições."),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Data de término das inscrições."),
                    Slots = table.Column<int>(type: "int", nullable: false, comment: "Quantidade de vagas disponíveis para inscrição."),
                    Status = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true, comment: "Indica se o evento está ativo (true) ou cancelado (false).")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.CheckConstraint("CK_Events_Type_Enum", "`Type` IN (1, 2, 3)");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Shift",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária do turno.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<int>(type: "int", nullable: false, comment: "Enum do turno (Morning/Afternoon/Evening).")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shift", x => x.Id);
                    table.CheckConstraint("CK_Shift_Name_Enum", "`Name` IN (1, 2, 3)");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária do usuário.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false, comment: "Nome do usuário.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<int>(type: "int", nullable: false, comment: "Status de conta do usuário (Active/Inactive)."),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false, comment: "Email do usuário.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false, comment: "Senha do usuário, armazenada de forma hash.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Enrollment = table.Column<int>(type: "int", nullable: true, comment: "Matrícula do aluno (número institucional)."),
                    Profile = table.Column<int>(type: "int", nullable: false, comment: "Perfil do usuário (Administrator/Monitor/Student)."),
                    Period = table.Column<int>(type: "int", nullable: true, comment: "Período atual do aluno (1 a 10)."),
                    Cpf = table.Column<string>(type: "varchar(11)", maxLength: 11, nullable: true, comment: "CPF do usuário.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResetPasswordToken = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false, comment: "Token de redefinição de senha.")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResetPasswordTokenExpiration = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Expiração do token de redefinição de senha.")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.CheckConstraint("CK_Users_Profile_Enum", "`Profile` IN (1, 2, 3)");
                    table.CheckConstraint("CK_Users_Status_Enum", "`Status`  IN (1, 2)");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária da mensagem de chat.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ChatId = table.Column<int>(type: "int", nullable: false, comment: "Chave estrangeira para o chat ao qual a mensagem pertence."),
                    SenderId = table.Column<int>(type: "int", nullable: false, comment: "ID do usuário remetente da mensagem."),
                    Content = table.Column<string>(type: "varchar(4000)", maxLength: 4000, nullable: false, comment: "Conteúdo textual da mensagem (até 4000 caracteres).")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Data/hora (UTC) em que a mensagem foi criada.")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Chats_ChatId",
                        column: x => x.ChatId,
                        principalTable: "Chats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EventShift",
                columns: table => new
                {
                    EventsId = table.Column<int>(type: "int", nullable: false),
                    ShiftsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventShift", x => new { x.EventsId, x.ShiftsId });
                    table.ForeignKey(
                        name: "FK_EventShift_Events_EventsId",
                        column: x => x.EventsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventShift_Shift_ShiftsId",
                        column: x => x.ShiftsId,
                        principalTable: "Shift",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Registrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, comment: "Chave primária da inscrição.")
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false, comment: "Data/hora da realização da inscrição."),
                    Status = table.Column<int>(type: "int", nullable: true, comment: "Resultado da seleção do evento para o inscrito (Registered/Selected/NotSelected)."),
                    Attended = table.Column<bool>(type: "tinyint(1)", nullable: true, comment: "Indica presença do participante no evento (true/false)."),
                    Justification = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, comment: "Justificativa de ausência (quando o participante não comparece).")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registrations", x => x.Id);
                    table.CheckConstraint("CK_Registrations_Status_Enum", "(`Status` IS NULL OR `Status` IN (1, 2, 3))");
                    table.ForeignKey(
                        name: "FK_Registrations_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Registrations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Shift",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 },
                    { 3, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatId",
                table: "ChatMessages",
                column: "ChatId");

            migrationBuilder.CreateIndex(
                name: "IX_Chats_UserAId_UserBId",
                table: "Chats",
                columns: new[] { "UserAId", "UserBId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventShift_ShiftsId",
                table: "EventShift",
                column: "ShiftsId");

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_EventId",
                table: "Registrations",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Registrations_UserId",
                table: "Registrations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Shift_Name",
                table: "Shift",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Cpf",
                table: "Users",
                column: "Cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Enrollment",
                table: "Users",
                column: "Enrollment",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "EventShift");

            migrationBuilder.DropTable(
                name: "Registrations");

            migrationBuilder.DropTable(
                name: "Chats");

            migrationBuilder.DropTable(
                name: "Shift");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
