import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizeService } from "../../api-authorization/authorize.service";
import { Guid } from 'guid-typescript';
import { iTask } from "../interfaces/iTask";
import { TaskService } from '../services/task.service';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit, OnDestroy {

  private userName: string = undefined;
  public userSubscriber = new Subscription();
  public getSubscriber = new Subscription();
  public postSubscriber = new Subscription();

  public allTasks: iTask[] = [];
  public newTask: iTask;
  public doneTasks: iTask[] = [];
  public lateTasks: iTask[] = [];
  public ontimeTasks: iTask[] = [];

  constructor(
    authorizeService: AuthorizeService,
    private taskService: TaskService) {

    this.userSubscriber = authorizeService.getUser()
      .subscribe(res => {
        this.userName = res.name;
      });

    this.getAllTasks();
  }

  ngOnInit(): void {
    this.newTask = this.createData();
    this.getAllTasks();
  }


  ngOnDestroy(): void {
    this.userSubscriber.unsubscribe();
    this.getSubscriber.unsubscribe();
    this.postSubscriber.unsubscribe();
  }

  createData(): iTask {
    let dateNow: Date = new Date();

    let timeStamp = this.allTasks.length > 0
      ? this.allTasks[this.allTasks.length - 1].dateStamp
      : dateNow;

    let dueTimeStamp = dateNow
      .setTime(dateNow.getTime() + (30 * 60 * 1000));

    let task: iTask = {
      id: Guid.create().toString(),
      dateStamp: timeStamp,
      dueDate: new Date(dueTimeStamp),
      taskDescription: "",
      userName: this.userName,
      isCommitted: false
    };

    return task;
  }

  onSelect(task: iTask): void {
    task.isCommitted = true;
    //console.log(`selected now => ${JSON.stringify(task)}`);
    this.postData(task);
  }

  saveTask() {
    let $this=this;
    //console.log(`saveTask => ${JSON.stringify(this.newTask)}`);

    let dueDate = new Date(this.newTask.dueDate);
    $this.newTask.dueDate = dueDate;
    this.newTask = $this.newTask;

    this.postData(this.newTask);

  }

  postData(task: iTask) {
    this.postSubscriber = this.taskService.sendTask(task)
      .subscribe(() => {
          this.newTask = this.createData();
          this.getAllTasks();
      }, error => console.error(error));
  }


  getAllTasks(){
    
    this.getSubscriber = this.taskService.getAllTAsks()
      .subscribe(res => {

        this.allTasks = res;
        
        this.ontimeTasks = this.allTasks.filter(task =>
          (task.dueDate >= task.dateStamp) &&
          (!task.isCommitted));

        this.lateTasks = this.allTasks.filter(task =>
          (task.dueDate < task.dateStamp) &&
          (!task.isCommitted));

        this.doneTasks = this.allTasks.filter(task =>
          task.isCommitted);
      });
  }


}
