import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Menuitems } from "../../models/menuItems.model";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})

export class SideBarComponent{


    menuItems:any[] = Menuitems
    roles:any[] = []
    basePath = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
    this.roles = this.authService.getUserRoles()
    this.basePath = this.authService.getBasePath();

    this.menuItems = this.menuItems.filter(item =>
      item.roles.some((role:string) => this.roles.includes(role))
    ).map(item => ({
      ...item,
      route: `${this.basePath}${item.route}` // Prefix each route
    }));
  }

}