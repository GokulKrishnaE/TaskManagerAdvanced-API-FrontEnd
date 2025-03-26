import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-priority-view',
  templateUrl: './task-priority-view.component.html',
  styleUrls: ['./task-priority-view.component.scss']
})
export class TaskPriorityViewComponent{

  tasks:any[] = []
  priorityGrouped!:{[key:string] : any[]}
  taskCounts!:{[key:string]: number}

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
      next: (data:any)=>{
        this.tasks = data.allTasks
        console.log(this.tasks)
        this.groupItemsByPriority()
        this.getTaskCounts()
        console.log(this.priorityGrouped)
      },
      error: (e)=>{
        this.globalService.showToastGlobalError()
      }
    })
  }

  getTaskCounts(){
    this.taskCounts = this.tasks.reduce((acc,task)=>{
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },{})

    console.log(this.taskCounts)
  }

  hasTasks(): boolean {
    return this.taskCounts && Object.keys(this.taskCounts).length > 0;
  }
  
  groupItemsByPriority() {
    this.priorityGrouped = this.tasks.reduce((acc, task) => {
      (acc[task.priority] = acc[task.priority] || []).push(task);
      return acc;
    }, {});
    console.log(this.priorityGrouped)
  }

  drop(event: CdkDragDrop<any[]>,newPriority:string) {
    const movedTask = event.item.data; // Get the dragged task
    if (!movedTask || !newPriority) {
      this.globalService.showToast('error','Error','Task data is undefined!')
      return;
    }
  
    let updatedTask = {...movedTask, priority:newPriority,userId:this.authService.getUserId()}
    this.apiService.put('tasks',updatedTask).subscribe({
      next: (data:any)=>{
        this.globalService.showToast('success','Success',data.message)
        this.getTasks()
      },
      error: (e)=>{
        this.globalService.showToast('error','Error',e.message)
      }
    })
  }
}
