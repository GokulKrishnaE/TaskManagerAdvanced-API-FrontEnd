import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { GlobalService } from "../../services/global.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit{

    loginForm!:FormGroup

    constructor(
        private FB:FormBuilder,
        private authService:AuthService,
        private router: Router,
        private globalService:GlobalService
    ){}

    ngOnInit(): void {
        this.initForm()
        this.authService.logout()
    }

    initForm(){
        this.loginForm = this.FB.group({
            username:['', Validators.required],
            password: ['', Validators.required]
        })
    }

    login(){
        if(this.loginForm.valid){
           this.authService.login(this.loginForm.value)
           .subscribe(res=> {
            if(res.success){
                console.log(this.authService.getUserRoles())
                if(this.authService.getUserRoles()?.includes('GlobalAdmin') || this.authService.getUserRoles()?.includes('Admin')){
                    this.router.navigate(['/admin/dashboard'])
                }
                else{
                    this.router.navigate(['/user/dashboard'])
                }
            }
            else{
                this.globalService.showToast('error','Error',res.message)
            }
           },
           error => {
            this.globalService.showToast('error','Error',"Something went wrong")
           }
        )
        }
        else{
            alert('invalid Form')
        }
    }

}