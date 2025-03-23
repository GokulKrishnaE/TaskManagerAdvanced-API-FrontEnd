using System.Net.Http;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Authorization;
using TaskManager.Dtos;
using TaskManager.Models;
using TaskManager.Services;

namespace TaskManager.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService taskService;
        private readonly IMapper mapper;

        public TasksController(ITaskService taskService, IMapper mapper)
        {
            this.taskService = taskService;
            this.mapper = mapper;
        }

        [HttpGet("debug-token")]
        [HasPermission(PermissionEnum.Read)]
        public IActionResult GetToken()
        {
            Console.WriteLine("/debug-token endpoint was hit!");

            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            Console.WriteLine($"Received Authorization Header: {authHeader}");

            var user = HttpContext.User;
            if (user == null || !user.Identity?.IsAuthenticated == true)
            {
                Console.WriteLine("User is not authenticated.");
                return Unauthorized();
            }

            Console.WriteLine("User is authenticated.");
            var claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }


        [HttpGet("all-tasks")]
        [HasPermission(PermissionEnum.Read)]
        //[HasPermission(PermissionEnum.Read)]
        public async Task<IActionResult> GetTasks() {

            var tasks = await taskService.GetTasksAsync();

            return Ok(tasks);
        }
        [HasPermission(PermissionEnum.Read)]
        [HttpGet("user-tasks/{userId}")]
        public async Task<IActionResult> GerUserTasks([FromRoute] string userId)
        {
            var tasks = await taskService.GetUserTaskAsync(userId);

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById([FromRoute] int id)
        {
            var task = await taskService.GetTaskByIdAsync(id);

            return Ok(task);
        }
        [HasPermission(PermissionEnum.Write)]
        [HttpPost]
        public async Task<IActionResult> addTask([FromBody] CreateTaskDto Task)
        {

            if (!Enum.IsDefined(typeof(PrioritiesEnum), Task.Priority) || !Enum.IsDefined(typeof(StatusEnum), Task.Status))
            {
                return BadRequest("Invalid enum value.");
            }
            var newTask = mapper.Map<TaskItem>(Task);
            await taskService.CreateTaskAsync(newTask);

            return Ok(Task);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] TaskDto Task)
        {
            if (!Enum.IsDefined(typeof(PrioritiesEnum), Task.Priority) || !Enum.IsDefined(typeof(StatusEnum), Task.Status))
            {
                return BadRequest("Invalid enum value.");
            }
            var updateTask = mapper.Map<TaskItem>(Task);

            bool result = await taskService.UpdateTaskAsync(updateTask);

            if (!result)
            {
                return NotFound(new { message = "task not found" });
            }

            return Ok(new { message = "task is updated" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask([FromRoute] int id)
        {
            bool result = await taskService.DeleteTaskAsync(id);
            if (!result)
            {
                return NotFound(new { message = "task not found" });
            }

            return Ok(new { message = "task is deleted" });
        }
    }
}
