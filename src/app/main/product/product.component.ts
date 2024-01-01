import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProductService } from 'app/api/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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
    private toastrService: ToastrService,
    private modalService: NgbModal,
  ) { }
  public selectedOption = 10;
  public searchValue
  public pageCurrent = 1;
  public totalPages = 1;
  public lstProducts = []
  public contentHeader: object
  public data: any
  @BlockUI('card-section') cardBlockUI: NgBlockUI;
  async loadData() {
    this.data = await this.productService.getAll(this.selectedOption, this.pageCurrent, this.searchValue)
    if (this.data.check === "ERROR") {
      this.lstProducts = []
      this.toastrService.error(
        'Error: ' + this.data.data,
        'Load data failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    else {
      this.lstProducts = this.data.data.items
      this.totalPages = this.data.data.meta.totalPages * 10
    }
  }
  async ngAfterViewInit() {
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
  async deleteProduct(id) {
    console.log(id)
  }
  async clickPagination() {
    this.cardBlockUI.start()
    await this.loadData()
    this.cardBlockUI.stop()
  }
  IDProduct: string
  nameProduct: string
  noteProduct: string
  status: string
  selectedStatusOption = 'active'
  hideAdd: boolean = true
  hideUpdate: boolean = true
  selectedStatusDisable: boolean = true
  private ngbModalRef: NgbModalRef;
  //#region Add Products
  modalAddOpen(modelName) {
    this.IDProduct = ""
    this.hideAdd = false
    this.hideUpdate = true
    this.selectedStatusDisable = true
    this.nameProduct = ""
    this.noteProduct = ""
    this.selectedStatusOption = 'active'
    this.ngbModalRef = this.modalService.open(modelName, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }
  async create() {
    const res = await this.productService.create(this.nameProduct, this.noteProduct)
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Create Success',
        text: `Create products ID: ${res.data.ID}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      await this.loadData()
    }
    else {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: ${JSON.stringify(res.data)}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
    this.ngbModalRef.close()

  }

  //#endregion 
  //#region Update Product
  async modalUpdateOpen(modelName, product) {
    this.IDProduct = product.ID
    this.nameProduct = product.name
    this.noteProduct = product.note
    this.selectedStatusOption = product.status
    this.hideAdd = true
    this.hideUpdate = false
    this.selectedStatusDisable = false
    this.ngbModalRef = this.modalService.open(modelName, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });

  }
  async update() {
    const product = {
      name : this.nameProduct,
      note : this.noteProduct,
      status : this.selectedStatusOption
    }
    const res = await this.productService.update(this.IDProduct,product)
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Update Success',
        text: `Update products ID: ${this.IDProduct}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      await this.loadData()
    }
    else {
      await Swal.fire({
        icon: 'error',
        title: 'Update ERROR',
        text: `Error: ${JSON.stringify(res.data)}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
    this.ngbModalRef.close()
  }
  //#endregion

}
