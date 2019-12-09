import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AuthorizeService } from "../../api-authorization/authorize.service";
import { Guid } from 'guid-typescript';
import { iTask } from "../interfaces/iTask";
import { TaskService } from '../services/task.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ModalTaskComponent } from '../modal/modal.task';



@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls:['./tasks.component.css']
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
    private taskService: TaskService,
    private modalService: NgbModal) {

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
      description: "",
      userName: this.userName,
      isCommitted: false
    };

    return task;
  }

  onSelect(task: iTask): void {
    const modalRef = this.modalService.open(ModalTaskComponent)
    modalRef.componentInstance.task = task;
    
    modalRef.result.then((result) => {
      //  console.log( `Accepted ${this.getDismissReason(result)}`);
      task.isCommitted = true;
      this.postData(task);
    }, (reason) => {
      //  console.log( `Dismissed ${this.getDismissReason(reason)}`);
    });
    //console.log(`selected now => ${JSON.stringify(task)}`);
  }
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }

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
