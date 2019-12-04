using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ToDoTasks.Models;

namespace ToDoTasks.Interfaces
{
    public interface ICacheService
    {
        Task AddAsync(ToDoTask chatMessage);
        Task<IReadOnlyCollection<ToDoTask>> GetAsync(string userName);
    }
}