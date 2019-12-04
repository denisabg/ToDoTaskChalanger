using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoTasks.Models;
using ToDoTasks.Services;

namespace ToDoTasks.Tests
{
    public static class TestService
    {

    
        private static readonly QueueService QueueS = new QueueService(delegate (ToDoTask task)
        {
            if (task == null) throw new ArgumentNullException(nameof(task));
        });

        private static readonly CacheService CacheS = new CacheService();


        public static async Task TestServiceAsync()
        {
            ToDoTask t1 = new ToDoTask
            {
                UserName = "1",
                TaskDescription = "1",
                DueDate = DateTime.UtcNow.AddMinutes(2)
            };
            ToDoTask t2 = new ToDoTask
            {
                UserName = "2",
                TaskDescription = "2",
                DueDate = DateTime.UtcNow.AddMinutes(2)
            };
            ToDoTask t3 = new ToDoTask
            {
                UserName = "1",
                TaskDescription = "3",
                DueDate = DateTime.UtcNow.AddMinutes(2)
            };

            await CacheS.AddAsync(t1);
            await CacheS.AddAsync(t2);
            await CacheS.AddAsync(t3);


            //var cache = await CacheS.GetAsync("1");




            await QueueS.SendAsync(t1);
            await QueueS.SendAsync(t2);
            await QueueS.SendAsync(t3);



            var service = new TaskToDoService(QueueS, CacheS);



            //var res = await service.GetAsync("1");
        }
    }

}
