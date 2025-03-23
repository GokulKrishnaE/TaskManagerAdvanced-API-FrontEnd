import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing.module';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AdminLayoutComponent } from './admin.layout.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';



@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminHomeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
