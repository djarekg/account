using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Account.Budget.Identity.Tokens.Jwt;

/// <summary>
/// Jwt token configuration record.
/// </summary>
/// <value></value>
public record JwtTokenConfiguration
{
    public string UserName { get; init; }
    public string SigningKey { get; init; }
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public TimeSpan Expiration { get; init; }
    public Claim[]? AdditionalClaims { get; init; }

    public JwtTokenConfiguration(string userName, string? signingKey = null, string? issuer = null, string? audience = null, int? tokenExpiry = 0, Claim[]? additionalClaims = null)
    {
        if (string.IsNullOrEmpty(userName) ||
            string.IsNullOrEmpty(signingKey) ||
            string.IsNullOrEmpty(issuer) ||
            string.IsNullOrEmpty(audience) ||
            tokenExpiry <= 0)
        {
            throw new ArgumentException("Invalid JwtTokenConfiguration");
        }

        UserName = userName;
        SigningKey = signingKey!;
        Issuer = issuer!;
        Audience = audience!;
        Expiration = TimeSpan.FromMinutes(int.Parse(tokenExpiry!.Value.ToString()));
        AdditionalClaims = additionalClaims;
    }

    /// <summary>
    /// Create a JWT security token.
    /// </summary>
    /// <returns>The <see cref="JwtSecurityToken"/> object.</returns>
    public JwtSecurityToken GenerateToken()
    {
        List<Claim> claims = new()
        {
            new(JwtRegisteredClaimNames.Sub, UserName),
            // this guarantees the token is unique
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (AdditionalClaims?.Length > 0)
        {
            claims.AddRange(AdditionalClaims);
        }

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(SigningKey));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            expires: DateTime.UtcNow.Add(Expiration),
            claims: claims,
            signingCredentials: creds
        );
    }
}
