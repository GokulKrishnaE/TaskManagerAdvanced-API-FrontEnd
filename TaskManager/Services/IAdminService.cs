using TaskManager.Dtos;

namespace TaskManager.Services
{
    public interface IAdminService
    {

        public Task<List<string>> GetAllRoles();
        public Task<StatusResponseDto> AssignRolesToUser(AssignRolesDto model);

        public Task<List<UserDto>> getAllUsers(string userEmail);

        public Task<UserDto> GetUserById(string id);

        public Task<StatusResponseDto> CreateUserAdmin(CreateUserDto userModel);

        public Task<StatusResponseDto> DeleteUserAdmin(string id);
    }
}
