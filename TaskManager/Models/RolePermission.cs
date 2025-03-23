
namespace TaskManager.Models
{
    public class RolePermission
    {
        public string RoleId { get; set; }
        public Role Role { get; set; }
        public string PermissionId { get; set; }    
        public Permission Permission { get; set; }
    }
}
