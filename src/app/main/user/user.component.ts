import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserService } from 'app/api/user/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'User',
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
            name: 'User',
            isLink: false
          }
        ]
      }
    }
  }
  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
  ) { }
  public selectedOption = 10;
  public searchValue
  public pageCurrent = 1;
  public totalPages = 1;
  public lstCategories = []
  public contentHeader: object
  public lstUser = []
  @BlockUI('card-section') cardBlockUI: NgBlockUI;
  async clickPagination() {
    this.cardBlockUI.start()
    await this.loadData()
    this.cardBlockUI.stop()
  }
  async loadData() {
    const data = await this.userService.getAll(this.selectedOption,this.pageCurrent,this.searchValue)
    console.log(data)
    if (data.check === "ERROR") {
      this.lstUser = []
      this.toastrService.error(
        'Error: ' + data.data,
        'Load data failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    else {
      this.lstUser = data.data.items
      this.totalPages = data.data.meta.totalPages * 10
    }
  }
  async ngAfterViewInit() {
    await this.loadData()
  }
}
