using ExtensionEventsManager.Core.Domain.Common.Entities;
using ExtensionEventsManager.Core.Domain.Exceptions;
using System.Security.Cryptography;

namespace ExtensionEventsManager.Core.Domain.Entities;
public class VerificationToken : BaseEntity
{
    public string Token { get; protected set; }
    public DateTime Expiration { get; protected set; }
    public int ResendCount { get; set; }

    public User User { get; protected set; }

    public bool ResendLimitExceeded => ResendCount >= 5;
    public int ExpitrationInMinutes => 10;
    
    public bool IsExpired => Expiration < DateTime.Now;

    public VerificationToken()
    {
        byte[] data = new byte[4];
        RandomNumberGenerator.Fill(data);

        var randomInteger = BitConverter.ToUInt32(data, 0);
        var token = (randomInteger % 1000000).ToString("D6");

        Token = token;

        Expiration = DateTime.Now.AddMinutes(ExpitrationInMinutes);
    }

    public void ResetExpiration()
    {
        Expiration = DateTime.Now.AddMinutes(ExpitrationInMinutes);
    }

    public void IncreaseResentCount()
    {
        if (ResendLimitExceeded)
        {
            throw new DomainValidationException("Limite de reenvio excedido");
        }

        ResendCount++;
    }

    public bool Validate(string token)
    {
        return !IsExpired && Token == token;
    }
}
