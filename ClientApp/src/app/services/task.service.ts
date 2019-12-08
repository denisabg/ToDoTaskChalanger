import { Injectable, Inject } from "@angular/core";
import { iTask } from "../interfaces/iTask";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class TaskService {

    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string,
    ) {
    }

    getAllTAsks(): Observable<iTask[]> {
      return (this.http.get<iTask[]>(`${this.baseUrl}tasks`).pipe(
        (catchError(
          (error: any) => {
            console.log(error);
            return throwError("Something went wrong on GetAll TAsks!");
          }
        )) as any
      )) as any;
    }


    sendTask(task: iTask): Observable<iTask> {
      return (this.http.post<iTask>(`${this.baseUrl}tasks`, task) //, this.httpOptionsObsolete)
        .pipe(
          (catchError(
            (error: any) => {
              console.log(error);
              return throwError("Something went wrong on Post Task!");
            }
          )) as any
        )) as any;
    }


    private httpOptionsObsolete = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Authorization': 'my-new-auth-token',
            'Api-Key': '{1d585c8e-a7e4-4ae8-9aa3-1819ab9d1a66}'
        })
    };

}
