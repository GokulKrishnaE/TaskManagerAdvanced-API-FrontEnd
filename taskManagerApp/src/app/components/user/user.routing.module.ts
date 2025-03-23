import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { userGuard } from 'src/app/shared/guards/user.guard';
import { TaskPriorityViewComponent } from 'src/app/shared/components/task-priority-view/task-priority-view.component';
import { PeopleComponent } from 'src/app/shared/components/people/people.component';

const routes: Routes = [
    {path: '', component: UserHomeComponent, canActivate: [userGuard], pathMatch: "full"},
    {path: 'priority-view', component: TaskPriorityViewComponent, canActivate: [userGuard]},
    {path: 'people', component: PeopleComponent, canActivate: [userGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
