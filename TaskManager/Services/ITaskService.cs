using TaskManager.Models;

namespace TaskManager.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItem>> GetTasksAsync();
        Task<IEnumerable<TaskItem>> GetUserTaskAsync(string userId);
        Task<TaskItem> GetTaskByIdAsync(int id);
        Task CreateTaskAsync(TaskItem task);
        Task<bool> UpdateTaskAsync(TaskItem task);
        Task<bool> DeleteTaskAsync(int id);
    }
}
