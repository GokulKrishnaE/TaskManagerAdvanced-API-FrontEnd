import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userFullName = this.authService.getUserFullName()

  constructor(private authService:AuthService){}
  

  logout(){
    this.authService.logout()
  }
}
