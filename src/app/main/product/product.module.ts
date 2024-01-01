import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { FormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ProductService } from 'app/api/product/product.service';


const routes: Routes = [
  { path: '', component: ProductComponent }
];

@NgModule({
  declarations: [ProductComponent],
  providers:[ProductService],
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
export class ProductModule { }
