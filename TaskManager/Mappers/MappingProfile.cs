using AutoMapper;
using TaskManager.Dtos;
using TaskManager.Models;

namespace TaskManager.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<TaskDto, TaskItem>().ReverseMap();
            CreateMap<CreateTaskDto, TaskItem>().ReverseMap();
        }
    }
}
