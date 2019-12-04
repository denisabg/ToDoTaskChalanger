using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoTasks.Interfaces;
using ToDoTasks.Models;

namespace ToDoTasks.Services
{
    public class QueueService : IQueueService
    {
        private readonly ConcurrentQueue<ToDoTask> _queue = new ConcurrentQueue<ToDoTask>();
        public Action<ToDoTask> OnToDoTaskReceived { get; }

        public QueueService(Action<ToDoTask> toDoAction)
        {
            OnToDoTaskReceived = toDoAction;
        }

        public async Task SendAsync(ToDoTask toDoTask)
        {
            _queue.Enqueue(toDoTask);
            OnToDoTaskReceived?.Invoke(toDoTask);
        }

    }
}
