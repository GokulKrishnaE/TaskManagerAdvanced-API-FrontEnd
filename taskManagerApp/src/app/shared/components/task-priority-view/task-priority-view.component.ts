import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-priority-view',
  templateUrl: './task-priority-view.component.html',
  styleUrls: ['./task-priority-view.component.scss']
})
export class TaskPriorityViewComponent{

  tasks:any[] = []
  priorityGrouped!:{[key:string] : any[]}

  constructor(
    private apiService:ApiService,
    private globalService:GlobalService,
    private authService:AuthService
  ){}



  ngOnInit(){
    this.getTasks()
  }

  getTasks(){
    this.apiService.get(`tasks/user-tasks/${this.authService.getUserId()}`)
    .subscribe({
      next: (data)=>{
        this.tasks = data
        console.log(this.tasks)
        this.groupItemsByPriority()
      },
      error: (e)=>{
        this.globalService.showToastGlobalError()
      }
    })
  }

  groupItemsByPriority() {
    this.priorityGrouped = this.tasks.reduce((acc, task) => {
      (acc[task.priority] = acc[task.priority] || []).push(task);
      return acc;
    }, {});
    console.log(this.priorityGrouped)
  }
}
