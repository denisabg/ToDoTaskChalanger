using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoTasks.Interfaces;
using ToDoTasks.Models;

namespace ToDoTasks.Services
{
    public static class ServiceFactory
    {
        private static IQueueService _queueService = new QueueService(OnMessageReceived);
        private static ICacheService _cacheService = new CacheService();

        private static void OnMessageReceived(ToDoTask obj)
        {
            _cacheService.AddAsync(obj);
        }

        public static ITaskToDoService Create(Action<ToDoTask> onMessageReceived = null)
        {
            var instance = new TaskToDoService(_queueService, _cacheService);

            return instance;
        }
    }
}
