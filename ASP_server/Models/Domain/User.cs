// Models/Domain/User.cs
using System;

namespace EventSchedule.Models.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Role { get; set; } // New field for admin status
    }
}
