using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoTasks.Interfaces;
using ToDoTasks.Models;

namespace ToDoTasks.Services
{
    public class TaskToDoService : ITaskToDoService
    {
        private IQueueService _queueService;
        private ICacheService _cacheService;
        public TaskToDoService(IQueueService queueService, ICacheService cacheService)
        {
            _queueService = queueService ?? throw new ArgumentNullException(nameof(queueService));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }


        public async Task SendAsync(ToDoTask toDoTask)
        {
            await _queueService.SendAsync(toDoTask);
            await _cacheService.AddAsync(toDoTask);
        }

        public async Task<IReadOnlyCollection<ToDoTask>> GetAsync(string userName)
        {
            return await _cacheService.GetAsync(userName);
        }

//        public async Task<IReadOnlyCollection<ToDoTask>> GetAsync()
//        {
//            DateTime lastTimeStamp = DateTime.UtcNow;
//            return await GetAsync(lastTimeStamp);
//        }
    }
}
