using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ExtensionEventsManager.Core.Application.Common.Interfaces;
using ExtensionEventsManager.Core.Application.Common.Options;
using ExtensionEventsManager.Core.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExtensionEventsManager.Core.WebAPI.Services;

public class TokenService : ITokenService
{
    private readonly IOptions<TokenSettings> _settings;

    public TokenService(IOptions<TokenSettings> settings)
    {
        _settings = settings;
    }

    public string GetToken(User user)
    {
        var claims = new List<Claim> {
                    new Claim("id", user.Id.ToString()),
                    new Claim("name", user.Name),
                    new Claim("email", user.Email),
                    new Claim("profile", user.Profile.ToString())
                };

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Value.SecurityKey));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var tokeOptions = new JwtSecurityToken(
            issuer: _settings.Value.Issuer,
            audience: _settings.Value.Audience,
            claims: claims,
            expires: DateTime.Now.AddHours(_settings.Value.ExpiringTimeInHours),
            signingCredentials: signinCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

        return tokenString;
    }
}
