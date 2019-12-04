using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoTasks.Models;

namespace ToDoTasks.Interfaces
{
    public interface ITaskToDoService
    {
        Task SendAsync(ToDoTask toDoTask);
        Task<IReadOnlyCollection<ToDoTask>> GetAsync(string userName);
    }
}