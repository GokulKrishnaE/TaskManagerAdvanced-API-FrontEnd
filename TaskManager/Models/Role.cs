using Microsoft.AspNetCore.Identity;

namespace TaskManager.Models
{
    public class Role : IdentityRole
    {

        public ICollection<RolePermission> RolePermissions { get; set; }
    }
}
