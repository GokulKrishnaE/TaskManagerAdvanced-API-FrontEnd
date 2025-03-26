import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html'
})


export class ErrorComponent{

    showLogoutTimer = false;
    countdown = 5;
    timer: any;
  
    constructor(private router: Router) {}
  
    ngOnInit() {
      const currentUrl = this.router.url;
      
      if (currentUrl.includes('unauthorized')) {
        this.showLogoutTimer = true;
        this.startLogoutTimer();
      }
    }
  
    startLogoutTimer() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    }


    ngOnDestroy(){
        this.countdown = 5;
    }
}