using Microsoft.AspNetCore.Authorization;

namespace TaskManager.Authorization
{
    public class HasPermissionAttribute : AuthorizeAttribute
    {

        public HasPermissionAttribute(PermissionEnum permission) : base( policy: permission.ToString())
        {
            
        }
    }
}
