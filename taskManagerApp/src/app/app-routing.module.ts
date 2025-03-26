import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLayoutComponent } from './components/user/user.layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { AdminLayoutComponent } from './components/admin/admin.layout.component';
import { RolesGuard } from './shared/guards/roles.guard';
import { userGuard } from './shared/guards/user.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'user', 
    component: UserLayoutComponent,
    loadChildren:()=>import ('./components/user/user.module').then(mod=>mod.UserModule),
    canActivate: [userGuard]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: ()=> import('./components/admin/admin.module').then(mod=>mod.AdminModule),
    canActivate: [userGuard]
  },
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
