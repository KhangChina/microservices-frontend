import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductService } from 'app/api/product/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit, AfterViewInit {
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Product',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Product',
            isLink: false
          }
        ]
      }
    }
  }
  constructor(
    private productService: ProductService,
    private toastrService : ToastrService
  ) { }
  public selectedOption = 10;
  public searchValue
  public pageCurrent = 1;
  public totalPages = 1;
  public lstProducts = []
  public contentHeader: object
  public data : any
  @BlockUI('card-section') cardBlockUI: NgBlockUI;
  async loadData()
  {
    this.data = await this.productService.getAll(this.selectedOption,this.pageCurrent,this.searchValue)
    if(this.data.check === "ERROR")
    {
      this.lstProducts = []
      this.toastrService.error(
        'Error: ' + this.data.data,
        'Load data failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    else
    {
      this.lstProducts = this.data.data.items
      this.totalPages = this.data.data.meta.totalPages * 10
    } 
  }
  async ngAfterViewInit(){
    await this.loadData()
  }
  filterByRole(event) {
    const filter = event.value;
  }
  filterByStatus(event) {
    const filter = event.value;
  }

  filterRows(roleFilter, planFilter, statusFilter) {
    // Reset search on select change
    this.searchValue = ''
  }
  filterUpdate(event) {
    // Reset ng-select on search
    // this.selectedRole = this.selectRole[0];
    // this.selectedStatus = this.selectStatus[0];
  }
  async deleteProduct(id)
  {
    console.log(id)
  }
  async clickPagination() {
    this.cardBlockUI.start()
    await this.loadData()
    this.cardBlockUI.stop()
  } 
}
