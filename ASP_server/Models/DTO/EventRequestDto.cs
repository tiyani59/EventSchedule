
namespace EventSchedule.DTOs
{
    public class EventRequestDto
    {
       
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public int Duration { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string CourseCode { get; set; }
        public string ExamCode { get; set; }
    }
}
