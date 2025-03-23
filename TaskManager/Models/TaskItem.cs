using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string TaskName { get; set; }
        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public StatusEnum Status { get; set; }  = StatusEnum.Todo;

        public PrioritiesEnum Priority { get; set; } = PrioritiesEnum.Medium;


        public string UserId { get; set; }

        required
        public ApplicationUser User { get; set; }

    }
}
