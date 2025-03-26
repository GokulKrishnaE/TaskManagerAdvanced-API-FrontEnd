import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AdminLayoutComponent } from './admin.layout.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { CMSHomeComponent } from './components/CMS/cms-home.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHomeComponent,
    UserListComponent,
    UserDetailsComponent,
    CMSHomeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
