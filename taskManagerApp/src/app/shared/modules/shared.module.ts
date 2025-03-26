import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {ToastModule} from 'primeng/toast'
import {TableModule} from 'primeng/table'
import {DropdownModule} from 'primeng/dropdown'



import { TasksComponent } from '../components/tasks/tasks.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ErrorComponent } from '../components/error/error.component';
import { HeaderComponent } from '../layout/components/header/header.component';
import { MessageService } from 'primeng/api';
import { RemoveUnderScorePipe } from '../pipes/remove-underscore.pipe';
import { TaskPriorityViewComponent } from '../components/task-priority-view/task-priority-view.component';
import { PeopleComponent } from '../components/people/people.component';
import { TaskCountComponent } from '../components/task-counts/task-counts.component';
import { SideBarComponent } from '../components/sidebar/sidebar.component';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { TaskCalendarViewComponent } from '../components/task-calendar-view/task-calenar-view.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { DragDropModule } from '@angular/cdk/drag-drop';




@NgModule({
  declarations: [
    TasksComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    HeaderComponent,
    RemoveUnderScorePipe,
    TaskPriorityViewComponent,
    PeopleComponent,
    TaskCountComponent,
    SideBarComponent,
    TaskCalendarViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    TabViewModule ,
    FullCalendarModule,
    DragDropModule
  ],
  exports:[
    CommonModule,
    TasksComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    HeaderComponent,
    ToastModule,
    TableModule,
    DropdownModule,
    TaskPriorityViewComponent,
    PeopleComponent,
    TaskCountComponent,
    ReactiveFormsModule,
    SideBarComponent,
    CalendarModule,
    TabViewModule ,
    FullCalendarModule,
    DragDropModule
  ],
  providers: [MessageService],
  bootstrap: []
})
export class SharedModule { }
