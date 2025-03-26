using TaskManager.Models;

namespace TaskManager.Dtos
{
    public class CreateTaskDto
    {
        public string TaskName { get; set; }
        public string? Description { get; set; }
        public bool? IsCompleted { get; set; } = false;

        public PrioritiesEnum Priority { get; set; } = PrioritiesEnum.Medium;

        public StatusEnum Status { get; set; } = StatusEnum.Todo;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? Deadline { get; set; }
        public string UserId { get; set; }
    }
}
