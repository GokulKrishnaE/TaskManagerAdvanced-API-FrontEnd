using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TaskManager.Dtos;
using TaskManager.Models;

namespace TaskManager.Services
{
    public class AuthService : IAuthService
    {
        public readonly UserManager<ApplicationUser> _userManager;
        public readonly SignInManager<ApplicationUser> _signInManager;
        public readonly IConfiguration _configuration;
        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }
        public async Task<string> LoginUSer(LoginDto loginModel)
        {
            var user = await _userManager.FindByNameAsync(loginModel.Username);
            if (user == null) return null;

            var result = await _signInManager.PasswordSignInAsync(loginModel.Username, loginModel.Password, false, false);
            if (!result.Succeeded) return null;

            return await GenerateJwtToken(user);
        }

        public async Task<IdentityResult> RegisterUser(RegisterDto userModel)
        {
            var user = new ApplicationUser { UserName = userModel.Username, Email = userModel.Email, Fullname = userModel.FullName };
            var result = await _userManager.CreateAsync(user, userModel.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            return result;
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            // Validate JWT key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            if (key.KeySize < 256)
            {
                throw new Exception("JWT Key must be at least 256 bits (32 bytes).");
            }

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Add claims
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim("username", user.UserName),
                new Claim("fullName", user.Fullname),
                new Claim("email", user.Email)
            };

            // Add roles (if needed)
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }

            // Create token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
 }
