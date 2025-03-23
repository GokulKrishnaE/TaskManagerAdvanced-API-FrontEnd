import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prioriy_Values, Status_Values } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit,OnDestroy{

  tasks:any[] = []
  taskCounts!:{[key:string]: number}
  isAddMode:boolean = false
  getTask!:any
  deleteTaskId:any = null
  showDeleteModal:boolean = false

  taskForm!:FormGroup

  editIndex: number | null = null;

  status_options = Status_Values
  priority_options  = Prioriy_Values

  constructor(
    private apiService:ApiService, 
    private authService:AuthService,
    private globalService:GlobalService,
    private fb:FormBuilder) {}


  ngOnInit(){
    this.getTasks()
    this.initTaskForm()
  }

  getTasks(){
    this.getTask =this.apiService.get(`tasks/user-tasks/${this.authService.getUserId()}`)
    .subscribe({
      next: (data:any[])=>{
        this.tasks = data
        this.getTaskCounts()
        console.log(this.tasks)
      },
      error: ()=> {
        this.globalService.showToastGlobalError()
      }
    })
  }

  initTaskForm(){
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Todo'],
      priority: ['Medium']
    })
  }

  toggleTaskForm(){
    this.isAddMode = !this.isAddMode
  }

  getTaskCounts(){
    this.taskCounts = this.tasks.reduce((acc,task)=>{
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },{})

    console.log(this.taskCounts)
  }
  
  ngOnDestroy(): void {
    this.getTask.unsubscribe()
  }

  submitForm(){
    if(this.taskForm.valid){
      let newTask = {...this.taskForm.value, userId:this.authService.getUserId()}
      this.apiService.post('tasks',newTask).subscribe(
        {next: (data)=>{
          console.log(data)
          this.getTasks()
          this.toggleTaskForm()
        },
        error: (e)=>{
          this.globalService.showToastGlobalError()
          console.log(e)
        }
      }
      )
    }
    else{
      this.globalService.showToastGlobalError()
    }
  }

  editTask(index:number,task:any){
    console.log(task,index)
    this.editIndex = index;
    this.taskForm.patchValue({
      taskName: task.taskName,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
  }

  saveTask(task:any){
    if(this.taskForm.valid){
      let updatedTask = {id:task.id,...this.taskForm.value, userId:this.authService.getUserId()}
      if(this.taskForm.value.status === 'Completed'){
        updatedTask.isCompleted = true
      }
      this.apiService.put('tasks',updatedTask).subscribe({
        next: (data:any)=>{
          console.log(data)
          this.globalService.showToast('success','Success',data.message)
          this.editIndex = null
          this.taskForm.reset()
          this.getTasks()
        },
        error: (e)=>{
          this.globalService.showToast('error','Error',e.message)
        }
      })
    }
    else{
      this.globalService.showToastGlobalError()
    }
  }
  closeEdit(){
    this.editIndex = null;
  }
  deleteWarning(id:any){
    this.deleteTaskId = id
    this.showDeleteModal  = true
  }
  deleteTask(){
    this.showDeleteModal  = false
    this.apiService.delete(`tasks/${this.deleteTaskId}`).subscribe(
      {next: (data)=>{
        this.deleteTaskId = null
        this.getTasks()
      },
      error: (e)=>{
        this.globalService.showToastGlobalError()
      }
    }
    )
  }

  hasTasks(): boolean {
    return this.taskCounts && Object.keys(this.taskCounts).length > 0;
  }
}
