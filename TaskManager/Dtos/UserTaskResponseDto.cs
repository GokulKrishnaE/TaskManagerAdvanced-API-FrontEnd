using TaskManager.Models;

namespace TaskManager.Dtos
{
    public class UserTaskResponseDto
    {
        public List<TaskItem> AllTasks { get; set; } = new();
        public List<TaskItem> OverdueTasks { get; set; } = new();
        public List<TaskItem> TodayTasks { get; set; } = new();
        public List<TaskItem> UpcomingTasks { get; set; } = new();
    }
}
