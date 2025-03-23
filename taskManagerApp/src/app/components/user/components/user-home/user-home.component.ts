import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {

  userFullName!:string|undefined;

  constructor(private authService:AuthService){}

  ngOnInit(){
    this.userFullName = this.authService.getUserFullName()
  }

}
