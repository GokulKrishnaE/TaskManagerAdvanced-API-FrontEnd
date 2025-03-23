import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { UserLayoutComponent } from './user.layout.component';
import { UserRoutingModule } from './user.routing.module';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';



@NgModule({
  declarations: [
    UserLayoutComponent,
    UserSidebarComponent,
    UserHomeComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
