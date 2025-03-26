import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Roles } from "src/app/shared/models/rolesModel";
import { ApiService } from "src/app/shared/services/api.service";
import { GlobalService } from "src/app/shared/services/global.service";

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html'
})


export class UserDetailsComponent{

    userId:string|null = ''
    userDetails!:any
    userRoles = Roles
    rolesForm!: FormGroup;

    constructor(
        private apiService:ApiService,
        private globalService:GlobalService,
        private route:ActivatedRoute,
        private fb:FormBuilder
    ){}

    ngOnInit(){

        const rolesGroup: any = {};
        this.userRoles.forEach(role => {
            rolesGroup[role.value] = new FormControl(false);
        });
    
        this.rolesForm = this.fb.group(rolesGroup);
        this.route.paramMap.subscribe(param=>{
            this.userId = param.get('userId')
            if(this.userId){
                this.getUserDetails(this.userId)
            }
        }) 
      
    }

    populateRoles() {
        if (!this.userDetails || !this.userDetails.roles) return;
        Object.keys(this.rolesForm.controls).forEach(role => {
            const isChecked = this.userDetails.roles.some((userRole:any) => userRole === role);
            this.rolesForm.get(role)?.setValue(isChecked);
        });
    }
    
    

    getUserDetails(id:string){
        this.apiService.get(`admin/user-details/${id}`)
        .subscribe({
            next: (data)=>{
                this.userDetails = data
                console.log(this.userDetails)
                this.populateRoles();
            },
            error: (e)=>{
                this.globalService.showToastGlobalError()
            }
        })
    }

    onRolesChange(){
        if(this.rolesForm.valid){
            const selectedRoles = Object.keys(this.rolesForm.value).filter(key => this.rolesForm.value[key]);
            var reqBody = {userId:this.userId, roles: selectedRoles}
            this.apiService.post('admin/add-remove-roles',reqBody)
            .subscribe({
                next: (data)=>{
                    console.log(data)
                    this.globalService.showToast('success','Success','User roles have been updated')
                    this.getUserDetails(this.userId as string)
                },
                error: (e)=>{
                    console.log(e)
                    this.globalService.showToastGlobalError()
                }
            })
        }
    }
}