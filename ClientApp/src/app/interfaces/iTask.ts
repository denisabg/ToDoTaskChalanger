import { Guid } from "guid-typescript";

export interface iTask {
    id: string;
    dateStamp: Date;
    userName: string;
    taskDescription: string;
    dueDate: Date;
}
