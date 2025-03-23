using Microsoft.AspNetCore.Identity;
using TaskManager.Dtos;

namespace TaskManager.Services
{
    public interface IAuthService
    {
       Task <IdentityResult> RegisterUser(RegisterDto userModel);
       Task <string> LoginUSer(LoginDto loginModel);
    }
}
