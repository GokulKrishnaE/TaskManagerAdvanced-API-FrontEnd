using TaskManager.Dtos;

namespace TaskManager.Services
{
    public interface IAdminService
    {

        public Task<List<string>> GetAllRoles();
        public Task<AddRolesDto> AssignRolesToUser(AssignRolesDto model);
    }
}
