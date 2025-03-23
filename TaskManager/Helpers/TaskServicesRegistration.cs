using TaskManager.Repositories;
using TaskManager.Services;

namespace TaskManager.Helpers
{
    public static class TaskServicesRegistration
    {
        public static void AddServices(this IServiceCollection services)
        {
            _ = services.AddScoped<ITaskRepository, TaskRepository>();
            _ = services.AddScoped<ITaskService, TaskService>();
            _ = services.AddScoped<IAuthService, AuthService>();
            _ = services.AddScoped<IAdminService, AdminServie>();

           // return services;
        }
    }
}
