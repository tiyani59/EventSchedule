using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using EventSchedule.Data;
using EventSchedule.Models.Domain;
using EventSchedule.Models.DTO;
using BCrypt.Net;

namespace EventSchedule.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Check if username is already taken
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                return BadRequest("Username is already taken.");
            }

            // Check if email is already taken
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email is already in use.");
            }

            // Hash the password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Save user to database
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Firstname = registerDto.Firstname,
                Lastname = registerDto.Lastname,
                Username = registerDto.Username,
                Email = registerDto.Email,
                Password = hashedPassword,
                Role = "user" // Default role is set to "user"
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(newUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Find user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password)) // Verify hashed password
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return Ok(new { Token = token, Message = "Logged in" });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]); // Assuming you have configured a secret key in appsettings.json
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("UserId", user.Id.ToString()),
                    new Claim("FirstName", user.Firstname.ToString()),
                    new Claim("LastName", user.Lastname.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("make-editor/{username}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MakeEditor(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Assign editor role
            user.Role = "editor";
            await _context.SaveChangesAsync();

            return Ok($"User '{username}' is now an editor.");
        }

        [HttpPost("make-admin/{username}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MakeAdmin(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Assign admin role
            user.Role = "admin";
            await _context.SaveChangesAsync();

            return Ok($"User '{username}' is now an admin.");
        }

        [HttpPost("make-user/{username}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MakeUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Assign user role
            user.Role = "user";
            await _context.SaveChangesAsync();

            return Ok($"User '{username}' is now a regular user.");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Generate a unique token for password reset
            var token = GenerateJwtToken(user);
            SendPasswordResetEmail(user.Email, token);

            // Send password reset email to the user
            // You need to implement your email sending logic here

            return Ok("Password reset email sent successfully.");
        }

        [HttpPost("reset-password/{token}")]
        public async Task<IActionResult> ResetPassword(string token, ResetPasswordDto resetPasswordDto)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]); // Assuming you have configured a secret key in appsettings.json

            try
            {
                SecurityToken securityToken;
                var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:ValidIssuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:ValidAudience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // No tolerance for token expiration
                }, out securityToken);

                var userIdClaim = ((JwtSecurityToken)securityToken).Claims.FirstOrDefault(c => c.Type == "UserId");

                if (userIdClaim == null)
                {
                    return BadRequest("UserId claim not found in token.");
                }

                var userId = Guid.Parse(userIdClaim.Value);

                // Extract expiration claim from token
                var expiryDateTime = securityToken.ValidTo;

                if (expiryDateTime < DateTime.UtcNow)
                {
                    return BadRequest("Token has expired.");
                }

                // Token is valid, proceed with password reset
                var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                // Hash the new password before saving
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.Password);
                user.Password = hashedPassword;

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(new { message = "Password reset successful." });
            }
            catch (SecurityTokenExpiredException)
            {
                return BadRequest("Token has expired.");
            }
            catch (SecurityTokenInvalidSignatureException)
            {
                return BadRequest("Invalid token signature.");
            }
            catch (SecurityTokenValidationException)
            {
                return BadRequest("Token validation failed.");
            }
            catch (Exception)
            {
                return BadRequest("Invalid token.");
            }
        }

        private void SendPasswordResetEmail(string userEmail, string token)
        {
            // Configure SMTP client for Gmail
            using (var client = new SmtpClient("smtp.gmail.com"))
            {
                client.Port = 587;
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("tiyanikevinbaloyi@gmail.com", "pmcsjpxwetybpigw");

                // Configure the email message
                var from = new MailAddress("tiyanikevinbaloyi@gmail.com", "Ikusasa");
                var to = new MailAddress(userEmail);
                var encodedToken = HttpUtility.UrlEncode(token);
                var domain = "http://localhost:3000";
                var message = new MailMessage(from, to)
                {
                    Subject = "Password Reset Instructions",
                    Body = $"<p>Please click the following link to reset your password: <a href='{domain}/reset-password?token={encodedToken}&email={userEmail}'>Reset Password</a></p>",
                    IsBodyHtml = true
                };

                // Send the email
                client.Send(message);
            }
        }
    }
}
