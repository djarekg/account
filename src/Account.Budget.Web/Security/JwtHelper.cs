using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Account.Budget.Web.Security;

public static class JwtHelper
{
    public static JwtSecurityToken GetJwtToken(JwtTokenConfiguration config)
    {
        if (!config.IsValid)
        {
            throw new ArgumentException("Invalid JWT token configuration");
        }

        List<Claim> claims = new()
        {
            new(JwtRegisteredClaimNames.Sub, config.UserName),
            // this guarantees the token is unique
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (config.AdditionalClaims?.Length > 0)
        {
            claims.AddRange(config.AdditionalClaims);
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            issuer: config.Issuer,
            audience: config.Audience,
            expires: DateTime.UtcNow.Add(config.Expiration),
            claims: claims,
            signingCredentials: creds
        );
    }
}
