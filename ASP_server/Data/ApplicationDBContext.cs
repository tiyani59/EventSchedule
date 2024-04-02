using Microsoft.EntityFrameworkCore;
using EventSchedule.Models.Domain;

namespace EventSchedule.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
    }
}
