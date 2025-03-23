using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Authorization;
using TaskManager.Dtos;
using TaskManager.Services;

namespace TaskManager.Controllers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;

        public AdminController(IAdminService adminService)
        {
            this.adminService = adminService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await adminService.GetAllRoles();
            return Ok(roles);
        }


        [HttpPost("addRemoveRoles")]
        [HasPermission(PermissionEnum.ManageUsers)]
        public async Task<IActionResult> AssignRolesToUser([FromBody] AssignRolesDto model)
        {
            var response = await adminService.AssignRolesToUser(model);

            if(response.Status == "failed")
            {
                return BadRequest(response);   
            }
            return Ok(response);
        }
    }
}
