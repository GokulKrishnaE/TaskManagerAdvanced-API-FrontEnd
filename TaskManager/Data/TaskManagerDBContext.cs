using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TaskManager.Models;
using Microsoft.AspNetCore.Identity;

namespace TaskManager.Data
{
    public class TaskManagerDBContext:IdentityDbContext<ApplicationUser,Role,string>
    {
        public TaskManagerDBContext(DbContextOptions <TaskManagerDBContext> options) : base(options)
        {
            
        }

        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany()
                .HasForeignKey(rp => rp.PermissionId);
        }

    }
}
