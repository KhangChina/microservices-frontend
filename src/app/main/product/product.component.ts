import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
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
  ) { }
  public selectedOption = 10;
  public searchValue
  public pageCurrent = 1;
  public totalPages = 1;
  public lstCategories = []
  public contentHeader: object
  @BlockUI('card-section') cardBlockUI: NgBlockUI;
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
  async clickPagination() {
    this.cardBlockUI.start()
   // await this.loadData()
    this.cardBlockUI.stop()
  } 
}
