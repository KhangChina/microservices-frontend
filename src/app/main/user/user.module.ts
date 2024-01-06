import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/api/user/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AuthGuard } from 'app/api/auth/helpers/auth.guards';


const routes: Routes = [
  { path: '', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'edit/:id', component: UserEditComponent ,canActivate: [AuthGuard]},
  { path: 'add', component: UserEditComponent ,canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [UserComponent, UserEditComponent],
  providers:[UserService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule, //import module core
    FormsModule,//import module core
    CoreCommonModule, //import module core(request)
    NgbModule,//import module core(request)
    NgSelectModule,
    BlockUIModule.forRoot(),
  ]
})
export class UserModule { }
