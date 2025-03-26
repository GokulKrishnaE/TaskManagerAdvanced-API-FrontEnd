using System.ComponentModel.DataAnnotations;

namespace TaskManager.Dtos
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Fullname { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        public List<string>? Roles { get; set; }
    }
}
