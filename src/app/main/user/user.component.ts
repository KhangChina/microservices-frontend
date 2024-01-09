import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserService } from 'app/api/user/user.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
    this.searchTerms.pipe(
      debounceTime(500)
    ).subscribe(async value => {
      console.log(value)
      await this.loadData()
    });
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
    const data = await this.userService.getAll(this.selectedOption, this.pageCurrent, this.searchValue)
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
  //#region Delete User
  async delete(id) {
    let data = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
    if (data.isConfirmed) {
      const res = await this.userService.delete(id)
      if (res.check === "OK") {
        await Swal.fire({
          icon: 'success',
          title: 'Delete Success',
          text: `Delete user ID: ${id}`,
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
        await this.loadData()
      }
      else {
        await Swal.fire({
          icon: 'error',
          title: 'Delete ERROR',
          text: `Error: ${JSON.stringify(res.data)}`,
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    }
  }
  //#endregion
  //#region search
  searchTerms = new Subject<string>();
  async searchAction(event) {
    this.searchTerms.next(event.term)
  }
  //#endregion
}
