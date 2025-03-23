using TaskManager.Models;
using TaskManager.Repositories;

namespace TaskManager.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            this.taskRepository = taskRepository;
        }
        public async Task CreateTaskAsync(TaskItem task)
        {
            await taskRepository.AddTaskAsync(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            return await taskRepository.DeleteTaskAsync(id);
        }

        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            return await taskRepository.GetTaskByIdAsync(id);
        }

        public async Task<IEnumerable<TaskItem>> GetTasksAsync()
        {
            return await taskRepository.GetAllTasksAsync();

        }

        public async Task<IEnumerable<TaskItem>> GetUserTaskAsync(string userId)
        {
            return await taskRepository.GetAllUserTasksAsync(userId);  
        }

        public async Task<bool> UpdateTaskAsync(TaskItem task)
        {
            var existingTask = await taskRepository.GetTaskByIdAsync(task.Id);

            if (existingTask == null)  return false;

            existingTask.TaskName = task.TaskName;
            existingTask.Description = task.Description;
            existingTask.IsCompleted = task.IsCompleted;
            existingTask.Status = task.Status;
            existingTask.Priority = task.Priority;

            return await taskRepository.UpdateTaskAsync(existingTask);
        }
    }
}
