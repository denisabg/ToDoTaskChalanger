using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoTasks.Models
{
    public class ToDoTask
    {
        public Guid Id { get; set; }
        public DateTime DateStamp { get; set; }

        public string UserName { get; set; }
        public string TaskDescription { get; set; }
        public DateTime DueDate { get; set; }


        public ToDoTask()
        {
            Id = Guid.NewGuid();
            DateStamp = DateTime.UtcNow;
        }
    }
}
