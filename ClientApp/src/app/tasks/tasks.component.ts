import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthorizeService } from "../../api-authorization/authorize.service";
import { Guid } from 'guid-typescript';
import { iTask } from "../interfaces/iTask";


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit, OnDestroy {

  private userName: string = undefined;
  public userSubscriber = new Subscription();
  public getSubscriber = new Subscription();
  public postSubscriber = new Subscription();

  public tasks: iTask[] = [];
  public newTask: iTask;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    authorizeService: AuthorizeService) {

    this.userSubscriber = authorizeService.getUser().subscribe(res => {
      this.userName = res.name;
    });


  }

  //private httpOptions = {
  //    headers: new HttpHeaders({
  //        'Content-Type': 'application/json; charset=utf-8',
  //        'Access-Control-Allow-Origin': '*',
  //        'Access-Control-Allow-Methods': 'POST, GET',
  //        'Authorization': 'my-new-auth-token',
  //        'Api-Key': '{1d585c8e-a7e4-4ae8-9aa3-1819ab9d1a66}'
  //    })
  //};


  ngOnInit(): void {

    console.log("user: ", this.userName);

    var newTask = this.createData();

    this.postData(newTask);

    newTask = this.createData();

    this.postData(newTask);



    let get = this.getData();

  }


  ngOnDestroy(): void {
    this.userSubscriber.unsubscribe();
    this.getSubscriber.unsubscribe();
    this.postSubscriber.unsubscribe();
  }

  createData() {
    let dateNow: Date = new Date();

    let timeStamp = this.tasks.length > 0
      ? this.tasks[this.tasks.length - 1].dateStamp
      : dateNow;


    let dueTimeStamp = dateNow
      .setTime(dateNow.getTime() + (30 * 60 * 1000));


    let newTask: iTask = {
      id: Guid.create().toString(),
      //Id: this.tasks.length.toString(),
      dateStamp: timeStamp,
      dueDate: new Date(dueTimeStamp),
      taskDescription: " xxx pokemon xxx ",
      userName: this.userName
    };

    return newTask;
  }

  //  getData(userName: string) {
  //      const options = { params: new HttpParams({ fromString: `userName=${userName}` }) };
  //      this.getSubscriber = this.http.get<iTask[]>(`${this.baseUrl}tasks`, options)
  //          .subscribe(result => {
  //              console.log(`res => ${result}`);
  //              this.tasks = result;
  //          }, error => console.error(error));
  //}

  getData() {
    this.getSubscriber = this.http.get<iTask[]>(`${this.baseUrl}tasks`)
      .subscribe(result => {
        console.log(`res => ${JSON.stringify(result)}`);
        this.tasks = result;
      }, error => console.error(error));
  }

  postData(task: iTask) {
    this.postSubscriber = this.addTask(task).subscribe();

  }

  addTask(task: iTask): Observable<iTask> {
    return this.http.post<iTask>(`${this.baseUrl}tasks`, task)//, this.httpOptions)
      .pipe(tap(
        res => {
          console.log(`posted -`, JSON.stringify(res));
        }
      ));
  }
}
