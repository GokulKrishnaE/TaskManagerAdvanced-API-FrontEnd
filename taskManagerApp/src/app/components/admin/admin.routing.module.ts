import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { TaskPriorityViewComponent } from 'src/app/shared/components/task-priority-view/task-priority-view.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RolesGuard } from 'src/app/shared/guards/roles.guard';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { CMSHomeComponent } from './components/CMS/cms-home.component';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { TaskCalendarViewComponent } from 'src/app/shared/components/task-calendar-view/task-calenar-view.component';


const routes: Routes = [
    {path: '', component:AdminHomeComponent,canActivate:[RolesGuard],data: { roles: ['Admin','GlobalAdmin'] }},
    {path: 'dashboard', component:AdminHomeComponent,canActivate:[RolesGuard],data: { roles: ['Admin','GlobalAdmin'] }},
        {path: 'calendar-view', component: TaskCalendarViewComponent},
    {path: 'priority-view', component:TaskPriorityViewComponent,canActivate:[RolesGuard],data: { roles: ['Admin','GlobalAdmin'] }},
    {path: 'people', component: UserListComponent, canActivate:[RolesGuard],data: { roles: ['Admin','GlobalAdmin'] }},
    {path: 'user-details/:userId', component: UserDetailsComponent, canActivate:[RolesGuard],data: { roles: ['Admin','GlobalAdmin'] }},
    {path: 'cms-home', component: CMSHomeComponent, canActivate:[RolesGuard],data: { roles: ['GlobalAdmin','CMS'] }},
    {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
