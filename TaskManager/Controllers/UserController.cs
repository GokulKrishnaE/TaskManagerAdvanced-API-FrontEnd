using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Dtos;
using TaskManager.Models;
using TaskManager.Services;

namespace TaskManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService authService;

        public UserController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto registerModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await authService.RegisterUser(registerModel);

            if (!result.Succeeded) return BadRequest(result.Errors);
            return Ok(new { message = "User registered successfully" });

        }

        [HttpPost("Login")] 
        public async Task<IActionResult> Login([FromBody] LoginDto loginModel)
        {
            var token = await authService.LoginUSer(loginModel);
            if (token == null) return Unauthorized("Invalid login attempt.");
            return Ok(new { token });
        }
    }
}
