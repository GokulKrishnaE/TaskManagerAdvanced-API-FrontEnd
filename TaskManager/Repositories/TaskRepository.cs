using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly TaskManagerDBContext context;

        public TaskRepository(TaskManagerDBContext context)
        {
            this.context = context;
        }
        public async Task AddTaskAsync(TaskItem task)
        {
           var savedTask = await context.AddAsync(task);
           await context.SaveChangesAsync();
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var currTask = await context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (currTask != null) {
                context.Tasks.Remove(currTask);
                return await context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await context.Tasks.ToListAsync(); 
        }

        public async Task<IEnumerable<TaskItem>> GetAllUserTasksAsync(string userId)
        {
            return await context.Tasks.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task<TaskItem> GetTaskByIdAsync(int id)
        {
            return await context.Tasks.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> UpdateTaskAsync(TaskItem task)
        {
            context.Tasks.Update(task);
            return await context.SaveChangesAsync() > 0;
        }
    }
}
