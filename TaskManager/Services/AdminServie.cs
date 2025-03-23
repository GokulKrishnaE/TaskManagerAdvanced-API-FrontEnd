using System.Data;
using Microsoft.AspNetCore.Identity;
using TaskManager.Dtos;
using TaskManager.Models;

namespace TaskManager.Services
{
    public class AdminServie : IAdminService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<Role> roleManager;

        public AdminServie(UserManager<ApplicationUser> userManager, RoleManager<Role> roleManager)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
        }
        public async Task<AddRolesDto> AssignRolesToUser(AssignRolesDto model)
        {
            var user = await userManager.FindByIdAsync(model.userId);

            if (user == null)
                return new AddRolesDto{ Status = "failed", Message= "User not found" };

            var currentRoles = await userManager.GetRolesAsync(user);

            // Roles to remove
            var rolesToRemove = currentRoles.Except(model.roles).ToList();

            if (rolesToRemove.Any())
            {
                var removeResult = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                    return new AddRolesDto { Status = "failed", Message= "Failed to remove existing roles." };
            }

            // Roles to add
            var rolesToAdd = model.roles.Except(currentRoles).ToList();
            if (rolesToAdd.Any())
            {
                var addResult = await userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                    return new AddRolesDto { Status = "failed", Message = "Failed to assign new roles." };
            }

            return new AddRolesDto { Status = "success", Message = "Roles updated" };
        }

        public async Task<List<string>> GetAllRoles()
        {
            return await Task.Run(() => roleManager.Roles.Select(r => r.Name).ToList());
        }
    }
}
