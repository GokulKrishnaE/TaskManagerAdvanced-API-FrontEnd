using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AdminController(IAdminService adminService, IHttpContextAccessor httpContextAccessor)
        {
            this.adminService = adminService;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await adminService.GetAllRoles();
            return Ok(roles);
        }


        [HttpPost("add-remove-roles")]
        //[HasPermission(PermissionEnum.ManageUsers)]
        public async Task<IActionResult> AssignRolesToUser([FromBody] AssignRolesDto model)
        {
            var response = await adminService.AssignRolesToUser(model);

            if(response.Status == "failed")
            {
                return BadRequest(response);   
            }
            return Ok(response);
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> getAllUsers()
        {
   
            var email = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

            Console.WriteLine(email);
            var users = await adminService.getAllUsers(email);

            if (users == null)
            {
                return BadRequest(new { message = "Something went wrong. Can't fetch users" });
            }

            return Ok(users);
        }

        [HttpGet("user-details/{id}")]
        public async Task<IActionResult> getUserDetails([FromRoute] string id)
        {
            var user = await adminService.GetUserById(id);

            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            return Ok(user);
        
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto model)
        {
            var response = await adminService.CreateUserAdmin(model);

            if(response.Status == "failed")
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            var response = await adminService.DeleteUserAdmin(id);
            if (response.Status == "failed")
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

    }
}
