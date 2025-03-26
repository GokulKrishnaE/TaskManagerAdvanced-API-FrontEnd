import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Roles } from "src/app/shared/models/rolesModel";
import { ApiService } from "src/app/shared/services/api.service";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html'
})


export class UserListComponent{

    allUsers:any[] = []
    createUserOpen:boolean = false
    showDeleteModal:boolean = false
    deleteUserId:string|null = null

    createUserForm!:FormGroup
    roles = Roles

    constructor(
        private apiService:ApiService,
        private globalService:GlobalService,
        private router:Router,
        private fb:FormBuilder
    ){}


    ngOnInit(){
        this.getAllUsers()
        this.createUserForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.roles.forEach(role => {
            this.createUserForm.addControl(role.value, new FormControl(false));
          });
    }

    
    getAllUsers(){
        this.apiService.get('admin/all-users')
        .subscribe({
            next: (data)=>{
                console.log(data)
                this.allUsers = data
            },
            error: (e)=>{
                this.globalService.showToastGlobalError()
            }
        })
    }

    viewUser(id:string){
        this.router.navigate([`/admin/user-details/${id}`])
    }

    createUser(){
        this.createUserOpen = true
    }

    onCreateUser(){
        if (this.createUserForm.invalid) {
            return;
          }
      
          const selectedRoles = this.roles
            .filter(role => this.createUserForm.get(role.value)?.value) // Only checked roles
            .map(role => role.value); 
            
          const requestData = {
            fullName: this.createUserForm.value.fullName,
            email: this.createUserForm.value.email,
            username: this.createUserForm.value.username,
            password: this.createUserForm.value.password,
            roles: selectedRoles
          };

          this.apiService.post('admin/create-user',requestData)
          .subscribe({
            next:(data)=>{
                console.log(data)
                this.getAllUsers()
            },
            error: (e)=>{
                console.log(e)
                this.globalService.showToastGlobalError()
            }
            
          })
      
          console.log(requestData)
          this.createUserForm.reset()
          this.createUserOpen = false
    }

    showDeleteConfirm(id:string){
        this.deleteUserId = id;
        this.showDeleteModal = true
    }

    deleteUser(){
        this.apiService.delete(`admin/delete-user/${this.deleteUserId}`)
        .subscribe({
            next: (data)=>{
                this.globalService.showToast('success','Success','User deleted successfully')
                this.deleteUserId = null;
                this.showDeleteModal = false
                this.getAllUsers()
            },
            error: (e)=>{
                console.log(e)
                this.deleteUserId = null;
                this.showDeleteModal = false
                this.globalService.showToastGlobalError()
            }
        })
    }
}