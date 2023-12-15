import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
const routes : Routes = [
      {
        path: '', canActivate: [AuthGuard],
        children:[{
          path: 'dashboard',
          component: DashboardComponent,
          data: { animation: 'dashboard' }
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full',
          data: { animation: 'dashboard' }
        }]
      }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [RouterModule.forChild(routes), ContentHeaderModule, TranslateModule, CoreCommonModule],
    exports: [DashboardComponent]
  })

export class AdminModule {}