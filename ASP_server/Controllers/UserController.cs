using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventSchedule.Data;
using EventSchedule.Models.Domain;


namespace EventSchedule.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpPut("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUser(Guid id, User user)
        {
            // Find the user in the database by id
            var userToUpdate = await _context.Users.FindAsync(id);

            // If the user doesn't exist, return a 404 Not Found response
            if (userToUpdate == null)
            {
                return NotFound();
            }

            // Update the properties of the user retrieved from the database with the properties of the user received in the request body
            userToUpdate.Firstname = user.Firstname;
            userToUpdate.Lastname = user.Lastname;
            userToUpdate.Username = user.Username;
            userToUpdate.Email = user.Email;
            userToUpdate.Role = user.Role;
            // Update other properties as needed

            // Check if the password field in the incoming user object is not empty and if it's different from the current password
            if (!string.IsNullOrEmpty(user.Password) && user.Password != userToUpdate.Password)
            {
                // Hash the password before updating it
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                userToUpdate.Password = hashedPassword;
            }

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle concurrency exception if needed
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Return a 204 No Content response to indicate success
            return NoContent();
        }



        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
