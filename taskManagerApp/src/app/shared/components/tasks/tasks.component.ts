import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prioriy_Values, Status_Values, TaskResponse } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit,OnDestroy{

  tasks:any[] = []
  overDueTasks:any[] = []
  todyTasks:any[] = []
  upcomingTasks:any[] = []
  taskCounts!:{[key:string]: number}
  isAddMode:boolean = false
  tableView:boolean = false
  getTask!:any
  deleteTaskId:any = null
  editTaskId:any = null
  showDeleteModal:boolean = false
  showEditModel:boolean = false
  deadlineMinDate:Date = new Date()

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
      next: (data:any)=>{
        this.tasks = data.allTasks
        this.overDueTasks = data.overdueTasks
        this.todyTasks = data.todayTasks
        this.upcomingTasks = data.upcomingTasks
        this.getTaskCounts()
        console.log(this.tasks)
        console.log(this.overDueTasks)
        console.log(this.todyTasks)
        console.log(this.upcomingTasks)
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
      priority: ['Medium'],
      deadline: ['']
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
      if (newTask.deadline) {
        const selectedDate = new Date(newTask.deadline);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        newTask.deadline = selectedDate.toISOString().split('T')[0];
      }
      console.log(newTask)
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

  editTaskModel(index:number,task:any){
    this.showEditModel = true
    this.editTask(index,task,false)
  }

  editTask(index:number,task:any,tableEdit=true){
    this.editTaskId = task.id
    if(tableEdit){
      this.editIndex = index;
    }
    this.taskForm.patchValue({
      taskName: task.taskName,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline) : null
    });
  }

  saveTask(){
    if(this.taskForm.valid){
      let updatedTask = {id:this.editTaskId,...this.taskForm.value, userId:this.authService.getUserId()}
      console.log(updatedTask)
      if(this.taskForm.value.status === 'Completed'){
        updatedTask.isCompleted = true
      }
      if (updatedTask.deadline) {
        const selectedDate = new Date(updatedTask.deadline);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        updatedTask.deadline = selectedDate.toISOString().split('T')[0];
      }
      this.apiService.put('tasks',updatedTask).subscribe({
        next: (data:any)=>{
          this.globalService.showToast('success','Success',data.message)
          this.editIndex = null
          this.showEditModel = false
          this.editTaskId = null
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
    this.showEditModel = false
    this.taskForm.reset()
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

  toggleTableView(){
    this.tableView = !this.tableView
  }
}
