using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Authorization;
using TaskManager.Models;

namespace TaskManager.Data.Seeders
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = scope.ServiceProvider.GetRequiredService<TaskManagerDBContext>();

            // Seed Permissions (Use GUID IDs)
            var existingPermissions = context.Permissions.ToList();
            var permissionsToSeed = Enum.GetValues(typeof(PermissionEnum))
                .Cast<PermissionEnum>()
                .Select(p => new Permission
                {
                    Id = Guid.NewGuid().ToString(), // Unique GUID
                    Name = p.ToString()
                })
                .ToList();

            // Add only missing permissions
            foreach (var permission in permissionsToSeed)
            {
                if (!existingPermissions.Any(p => p.Name == permission.Name)) // Check by Name instead of ID
                {
                    context.Permissions.Add(permission);
                }
            }

            await context.SaveChangesAsync(); // Save Permissions first

            // Retrieve the latest permissions (with correct IDs)
            var permissions = await context.Permissions.ToListAsync();

            // Seed Roles
            string[] roles = { "GlobalAdmin", "Admin", "User", "CMS", "Visitor" };
            foreach (var role in roles)
            {
                var existingRole = await roleManager.FindByNameAsync(role);
                if (existingRole == null)
                {
                    var newRole = new Role { Name = role };
                    var roleCreationResult = await roleManager.CreateAsync(newRole);
                    if (!roleCreationResult.Succeeded)
                    {
                        throw new Exception($"Failed to create role {role}: {string.Join(", ", roleCreationResult.Errors.Select(e => e.Description))}");
                    }

                    // Retrieve role with correct ID
                    var createdRole = await roleManager.FindByNameAsync(role);
                    if (createdRole == null) throw new Exception($"Role {role} was not found after creation.");

                    // Assign Permissions to Roles
                    var rolePermissions = role switch
                    {
                        "GlobalAdmin" => permissions, // GlobalAdmin has all permissions
                        "Admin" => permissions.Where(p => p.Name != PermissionEnum.CMS.ToString()),
                        "CMS" => permissions.Where(p => p.Name == PermissionEnum.CMS.ToString()),
                        "User" => permissions.Where(p => p.Name == PermissionEnum.Read.ToString() || p.Name == PermissionEnum.Write.ToString() || p.Name == PermissionEnum.Delete.ToString()),
                        "Visitor" => permissions.Where(p => p.Name == PermissionEnum.Read.ToString()),
                        _ => Enumerable.Empty<Permission>()
                    };

                    foreach (var permission in rolePermissions)
                    {
                        if (!context.RolePermissions.Any(rp => rp.RoleId == createdRole.Id && rp.PermissionId == permission.Id))
                        {
                            var rolePermission = new RolePermission
                            {
                                RoleId = createdRole.Id,
                                PermissionId = permission.Id  // Use the correct GUID from Permission table
                            };
                            context.RolePermissions.Add(rolePermission);
                        }
                    }

                    await context.SaveChangesAsync(); // Save Role-Permissions
                }
            }

            // Seed Admin User
            var adminEmail = "admin@taskmanager.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var user = new ApplicationUser
                {
                    UserName = "admin",
                    Fullname = "Admin",
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(user, "Admin@123"); // Set a default admin password
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "GlobalAdmin");
                }
            }

        }
    }
}
