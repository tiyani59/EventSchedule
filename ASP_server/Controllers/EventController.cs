using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventSchedule.Data;
using EventSchedule.Models.Domain;
using EventSchedule.Models.DTO;
using EventSchedule.DTOs;

namespace EventSchedule.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public EventController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return await _context.Events.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        [HttpPost]
        [Authorize(Roles = "admin, editor")]
        public async Task<ActionResult<Event>> CreateEvent(EventRequestDto eventRequest)
        {
            var userName = User.Identity.Name;
            var firstName = userName.Split(' ')[0];
            var capitalizedFirstName = char.ToUpper(firstName[0]) + firstName.Substring(1);

            // Convert UTC time to South African time zone
            var saTimeZone = TimeZoneInfo.FindSystemTimeZoneById("South Africa Standard Time");
            var saTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, saTimeZone);
            Console.WriteLine(saTimeZone);
            var @event = new Event
            {
                Id = Guid.NewGuid(),
                Title = eventRequest.Title,
                Start = TimeZoneInfo.ConvertTimeFromUtc(eventRequest.Start, saTimeZone),
                Duration = eventRequest.Duration,
                Description = eventRequest.Description,
                Category = eventRequest.Category,
                Price = eventRequest.Price,
                CourseCode = eventRequest.CourseCode,
                ExamCode = eventRequest.ExamCode,
                CreatedAt = saTime,
                CreatedBy = capitalizedFirstName,
                UpdatedAt = saTime,
                UpdatedBy = capitalizedFirstName
            };

            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, @event);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin, editor")]
        public async Task<IActionResult> UpdateEvent(Guid id, EventRequestDto eventRequest)
        {
            var existingEvent = await _context.Events.FindAsync(id);

            if (existingEvent == null)
            {
                return NotFound();
            }

            var userName = User.Identity.Name;
            var firstName = userName.Split(' ')[0];
            var capitalizedFirstName = char.ToUpper(firstName[0]) + firstName.Substring(1);

            // Convert UTC time to South African time zone
            var saTimeZone = TimeZoneInfo.FindSystemTimeZoneById("South Africa Standard Time");
            var saTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, saTimeZone);

            Console.WriteLine(saTimeZone);
            Console.WriteLine(saTime);

            // Update properties of the existing event based on the eventRequest
            existingEvent.Title = eventRequest.Title;
            existingEvent.Start = TimeZoneInfo.ConvertTimeFromUtc(eventRequest.Start, saTimeZone);
            existingEvent.Duration = eventRequest.Duration;
            existingEvent.Description = eventRequest.Description;
            existingEvent.Category = eventRequest.Category;
            existingEvent.Price = eventRequest.Price;
            existingEvent.CourseCode = eventRequest.CourseCode;
            existingEvent.ExamCode = eventRequest.ExamCode;
            existingEvent.UpdatedAt = saTime;
            existingEvent.UpdatedBy = capitalizedFirstName;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin, editor")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(Guid id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}
