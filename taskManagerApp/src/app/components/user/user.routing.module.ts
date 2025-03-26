import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { userGuard } from 'src/app/shared/guards/user.guard';
import { TaskPriorityViewComponent } from 'src/app/shared/components/task-priority-view/task-priority-view.component';
import { PeopleComponent } from 'src/app/shared/components/people/people.component';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { TaskCalendarViewComponent } from 'src/app/shared/components/task-calendar-view/task-calenar-view.component';

const routes: Routes = [
    {path: '', component: UserHomeComponent, pathMatch: "full"},
    {path: 'dashboard', component: UserHomeComponent, pathMatch: "full"},
    {path: 'priority-view', component: TaskPriorityViewComponent},
    {path: 'calendar-view', component: TaskCalendarViewComponent},
    {path: 'people', component: PeopleComponent},
    {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
