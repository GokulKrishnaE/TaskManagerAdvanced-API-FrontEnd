using System.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<StatusResponseDto> AssignRolesToUser(AssignRolesDto model)
        {
            var user = await userManager.FindByIdAsync(model.userId);

            if (user == null)
                return new StatusResponseDto { Status = "failed", Message= "User not found" };

            var currentRoles = await userManager.GetRolesAsync(user);

            // Roles to remove
            var rolesToRemove = currentRoles.Except(model.roles).ToList();

            if (rolesToRemove.Any())
            {
                var removeResult = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                    return new StatusResponseDto { Status = "failed", Message= "Failed to remove existing roles." };
            }

            // Roles to add
            var rolesToAdd = model.roles.Except(currentRoles).ToList();
            if (rolesToAdd.Any())
            {
                var addResult = await userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                    return new StatusResponseDto { Status = "failed", Message = "Failed to assign new roles." };
            }

            return new StatusResponseDto { Status = "success", Message = "Roles updated" };
        }

        public async Task<StatusResponseDto> CreateUserAdmin(CreateUserDto userModel)
        {
            if (await userManager.FindByEmailAsync(userModel.Email) != null)
            {
                return new StatusResponseDto{Status="failed", Message="User with this email already exists." };
            }

            var user = new ApplicationUser
            {
                UserName = userModel.Username,
                Email = userModel.Email,
                Fullname = userModel.Fullname
            };

            var result = await userManager.CreateAsync(user, userModel.Password);
            
            if (!result.Succeeded)
            {
                return new StatusResponseDto { Status="failed", Message = "User creation failed." };
            }

            // Assign roles if provided
            if (userModel.Roles != null && userModel.Roles.Any())
            {
                foreach (var role in userModel.Roles)
                {
                    if (await roleManager.RoleExistsAsync(role))
                    {
                        await userManager.AddToRoleAsync(user, role);
                    }
                }
            }

            return new StatusResponseDto { Status="success",  Message = "User created successfully." };
        }

        public async Task<List<string>> GetAllRoles()
        {
            return await Task.Run(() => roleManager.Roles.Select(r => r.Name).ToList());
        }

        public async Task<List<UserDto>> getAllUsers(string userEmail)
        {
            var users = await userManager.Users.ToListAsync();
            var userList = new List<UserDto>();

            foreach (var user in users)
            {
                if (user.Email == userEmail) continue; // Skip logged-in user

                var roles = await userManager.GetRolesAsync(user);
                if (roles.Contains("GlobalAdmin")) continue; // Skip GlobalAdmin users

                userList.Add(new UserDto
                {
                    Id = user.Id,
                    FullName = user.Fullname,
                    Email = user.Email,
                    Roles = roles.ToList()
                });
            }

            return userList;
        }

        public async Task<UserDto> GetUserById(string id)
        {
            var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == id);

            if(user != null)
            {
               var roles = await userManager.GetRolesAsync(user);
                var currentUser = new UserDto
                {
                    Id = user.Id,
                    FullName = user.Fullname,
                    Email = user.Email,
                    Roles = roles.ToList()
                };

                return currentUser;
            }
            return null;
        }


        public async Task<StatusResponseDto> DeleteUserAdmin(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
            {
                return new StatusResponseDto {Status="failed", Message = "User not found" };
            }

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return new StatusResponseDto { Status = "failed", Message = "Failed to deleteUser" };
            }

            return new StatusResponseDto { Status = "success", Message = "User Deleted" };
        }
    }
}
