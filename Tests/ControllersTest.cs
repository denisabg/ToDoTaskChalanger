using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ToDoTasks.Controllers;
using ToDoTasks.Models;

namespace ToDoTasks.Tests
{
    public static class ControllersTest
    {
        // Arrange
        private static TasksController controller;

        // controller.PostAsync(new ToDoTask
        //{
        //    TaskDescription = "33",
        //    UserName = "1",
        //    DueDate = DateTime.UtcNow.AddMinutes(2)
        //});

         // Act


//         public static Task<IEnumerable<ToDoTask>> Get()
//         {
//             var result = controller.Get();
//             return result;
//         }

         public static Task<ToDoTask> PosTask()
         {
             var result= controller.Post(new ToDoTask()
             {
                 TaskDescription = "33",
                 UserName = "1",
                 DueDate = DateTime.UtcNow.AddMinutes(2)
             });

             return result;
         }


    }
}
