import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserService } from 'app/api/user/user.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'app/api/product/product.service';
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
    //Search User
    this.searchTerms.pipe(
      debounceTime(500)
    ).subscribe(async value => {
      console.log(value)
      await this.loadData()
    });
    //Search Product
    this.searchDebounceTimeProduct.pipe(
      debounceTime(500)
    ).subscribe(async value => {
      console.log(value)
      await this.loadProduct()
    });

  }
  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private productService: ProductService
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
  //#region Add, Delete and Update products
  private ngbModalRef: NgbModalRef

  async openModalProductManager(modelName, userID) {
    this.ngbModalRef = this.modalService.open(modelName, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
    this.userID = userID
    await this.loadProduct()
    await this.loadDataProductForUser()
  }
  private lstProduct = []
  selectedProduct: any
  private loadingSelectProduct: boolean
  async loadProduct() {
    this.loadingSelectProduct = true
    const data = await this.productService.getAll(10, 1, this.dataSearchProduct)
    this.loadingSelectProduct = false
    if (data.check === "ERROR") {
      this.lstProduct = []
      this.toastrService.error(
        'Error: ' + data.data,
        'Load data product failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    else {
      this.lstProduct = data.data.items
    }
  }
  searchDebounceTimeProduct = new Subject<string>();
  dataSearchProduct: string = ""
  async searchProduct(data) {
    //Get dada Search
    this.dataSearchProduct = data.term
    this.searchDebounceTimeProduct.next(data.term)
  }
  private userID: string
  async updateProductForUser() {
    if (!this.userID || !this.selectedProduct) {
      return
    }
    const res = await this.userService.updateProductForUser(this.userID, this.selectedProduct)
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Create Success',
        text: `Create product`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      await this.loadDataProductForUser()
    }
    else {
      await Swal.fire({
        icon: 'error',
        title: 'Update product ERROR',
        text: `Error: ${JSON.stringify(res.data)}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
    //this.ngbModalRef.close()
  }
  private lstProductForUser = []
  async loadDataProductForUser() {
    const data = await this.userService.getProductByIdUser(this.userID)
    if (data.check === "ERROR") {
      this.lstUser = []
      this.toastrService.error(
        'Error: ' + data.data,
        'Load data failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    else {
      this.lstProductForUser = data.data.items
    }
  }
  async deleteProductForUser(productID) {
    if (!this.userID || !productID) {
      return
    }
    const res = await this.userService.deleteProductByIDProductAndUser(this.userID, productID)
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Delete Success',
        text: `Create products ID: ${res.data.ID}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      await this.loadDataProductForUser()
    }
    else {
      await Swal.fire({
        icon: 'error',
        title: 'Delete product ERROR',
        text: `Error: ${JSON.stringify(res.data)}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
  }
  //#endregion
}
