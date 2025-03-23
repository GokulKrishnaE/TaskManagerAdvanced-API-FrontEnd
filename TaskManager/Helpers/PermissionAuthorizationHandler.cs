using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskManager.Data;
using TaskManager.Models;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TaskManagerDBContext _context;

    public PermissionAuthorizationHandler(UserManager<ApplicationUser> userManager, TaskManagerDBContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        // Get User ID from Token
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? context.User.FindFirstValue(ClaimTypes.Name); // Fallback

        if (string.IsNullOrEmpty(userId))
        {
            context.Fail(); // Explicitly fail if no user found
            return;
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            context.Fail();
            return;
        }

        // Get user's roles
        var roles = await _userManager.GetRolesAsync(user);
        if (roles == null || !roles.Any())
        {
            context.Fail();
            return;
        }

        // Check if any of the user's roles have the required permission
        var hasPermission = await _context.RolePermissions
            .AnyAsync(rp => roles.Contains(rp.Role.Name) && rp.Permission.Name == requirement.Permission.ToString()); // Ensure correct comparison

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}
