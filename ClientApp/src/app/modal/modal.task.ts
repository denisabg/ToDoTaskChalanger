import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { iTask } from '../interfaces/iTask';

@Component({
  selector: 'modal-task',
  templateUrl: './modal.task.html'
})
export class ModalTaskComponent {
  @Input() task: iTask;

  constructor(public modal: NgbActiveModal) {

  }
}