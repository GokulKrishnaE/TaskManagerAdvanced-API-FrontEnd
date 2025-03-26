using TaskManager.Dtos;
using TaskManager.Models;

namespace TaskManager.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetAllTasksAsync();
        Task<UserTaskResponseDto> GetAllUserTasksAsync(string userId);
        Task<TaskItem> GetTaskByIdAsync(int id);
        Task AddTaskAsync(TaskItem task);
        Task<bool> UpdateTaskAsync(TaskItem task);
        Task<bool> DeleteTaskAsync(int id);
    }
}
