using ExtensionEventsManager.Core.Domain.Common.Entities;
using ExtensionEventsManager.Core.Domain.Common.Enums;
using ExtensionEventsManager.Core.Domain.Enums;
using ExtensionEventsManager.Core.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

namespace ExtensionEventsManager.Core.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; protected set; }
    public Status Status { get; protected set; }
    public string Email { get; protected set; }
    public string Password { get; protected set; }
    public int? Enrollment {  get; protected set; }
    public ProfileEnum Profile { get; protected set; }
    public int? Period { get; protected set; }
    public string? Cpf { get; protected set; }
    public string ResetPasswordToken { get; protected set; }
    public DateTime ResetPasswordTokenExpiration {  get; protected set; }

    private static readonly PasswordHasher<User> PasswordHasher = new PasswordHasher<User>();

    public User(string name, string email)
    {
        SetName(name);
        SetEmail(email);

        Status = Status.Active;
        Profile = ProfileEnum.Student;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrEmpty(name)) throw new DomainValidationException("O nome não pode ser nulo");

        Name = name;
    }

    public void SetEmail(string email)
    {
        string emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

        if (!Regex.IsMatch(email, emailRegex))
        {
            throw new DomainValidationException("Email inválido");
        }

        Email = email;
    }

    public void SetPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new DomainValidationException("A senha não pode ser nula");
        }

        if (password.Length < 6)
        {
            throw new DomainValidationException("A senha deve ter pelo menos 6 caracteres");
        }

        Password = PasswordHasher.HashPassword(this, password);

        ResetPasswordToken = string.Empty;
    }

    public bool VerifyPassword(string email, string password)
    {
        var result = PasswordHasher.VerifyHashedPassword(this, Password, password);
        return email == Email && result == PasswordVerificationResult.Success;
    }

    public string CreatePasswordResetToken()
    {
        return Guid.NewGuid().ToString();
    }

    public void SetEnrollment(int? enrollment)
    {
        Enrollment = enrollment;
    }

    public void SetPeriod(int? period)
    {
        Period = period;
    }

    public void SetProfile(ProfileEnum profile)
    {
        Profile = profile;
    }

    public void SetStatus(Status status)
    {
        Status = status;
    }

    public void SetCpf(string cpf)
    {
        var digits = Regex.Replace(cpf, @"\D", "");

        if (!IsValidCpf(digits))
            throw new DomainValidationException("CPF inválido.");

        Cpf = digits;
    }

    private static bool IsValidCpf(string digitsOnly)
    {
        if (string.IsNullOrEmpty(digitsOnly) || digitsOnly.Length != 11)
            return false;

        if (new string(digitsOnly[0], 11) == digitsOnly)
            return false;

        int sum = 0;
        for (int i = 0; i < 9; i++)
            sum += (digitsOnly[i] - '0') * (10 - i);

        int remainder = sum % 11;
        int d1 = remainder < 2 ? 0 : 11 - remainder;
        if ((digitsOnly[9] - '0') != d1)
            return false;

        sum = 0;
        for (int i = 0; i < 10; i++)
            sum += (digitsOnly[i] - '0') * (11 - i);

        remainder = sum % 11;
        int d2 = remainder < 2 ? 0 : 11 - remainder;

        return (digitsOnly[10] - '0') == d2;
    }
}
