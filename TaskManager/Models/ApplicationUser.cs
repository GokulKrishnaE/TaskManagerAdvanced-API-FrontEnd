using Microsoft.AspNetCore.Identity;

namespace TaskManager.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Fullname { get; set; }
    }
}
