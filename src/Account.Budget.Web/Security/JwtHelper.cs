using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Account.Budget.Web.Security;

/// <summary>
/// Helper class for JWT tokens.
/// </summary>
public static class JwtHelper
{
    /// <summary>
    /// Create a JWT security token.
    /// </summary>
    /// <param name="config">The <see cref="JwtTokenConfiguration"/> object.</param>
    /// <returns>The <see cref="JwtSecurityToken"/> object.</returns>
    public static JwtSecurityToken GetJwtToken(JwtTokenConfiguration config)
    {
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

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(config.SigningKey));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            issuer: config.Issuer,
            audience: config.Audience,
            expires: DateTime.UtcNow.Add(config.Expiration),
            claims: claims,
            signingCredentials: creds
        );
    }
}
