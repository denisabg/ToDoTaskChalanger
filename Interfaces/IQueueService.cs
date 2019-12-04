using System;
using System.Threading.Tasks;
using ToDoTasks.Models;

namespace ToDoTasks.Interfaces
{
    public interface IQueueService
    {
        Task SendAsync(ToDoTask chatMessage);
        Action<ToDoTask> OnToDoTaskReceived { get; }
    }
}