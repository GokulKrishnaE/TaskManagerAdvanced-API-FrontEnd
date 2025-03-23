import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { userGuard } from 'src/app/shared/guards/user.guard';
import { TaskPriorityViewComponent } from 'src/app/shared/components/task-priority-view/task-priority-view.component';


const routes: Routes = [
    {path: '', component:AdminHomeComponent, canActivate:[userGuard]},
    {path: 'priority-view', component:TaskPriorityViewComponent, canActivate:[userGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
