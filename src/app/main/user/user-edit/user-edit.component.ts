import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from 'app/api/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit {

  constructor(
    public router: Router,
    private userService: UserService,
  ) { }
  public contentHeader: object;
  //Edit User
  public url = this.router.url;
  public urlLastValue;
  public selectStatus: any = [];
  public selectRole: any = [];
  public rows;
  public currentRow;
  public tempRow;

  ID: string = ""
  email: string = "";
  phone_number: string = "";
  password: string = "";
  rePassword: string = "";
  verified_phone: boolean = true
  verified_email: boolean = true
  status: string = "active"
  role: string = "customer"
  send_mail: string = ""
  last_name: string = ""
  first_name: string = "Unknown"
  birthday: string = ""
  avatarImage: string = "";
  avatarImageID: string = ""
  //Validate
  validEmail = ""
  validPhone_number = ""
  validRePassword = ""
  validPassword = ""
  //Control UI Update
  btnCreateHide: boolean = false
  textPassHide: boolean = false
  textRepassHide: boolean = false
  btnUpdateHide: boolean = true
  textDisPhone: boolean = false
  textDisEmail: boolean = false
  isLoading: boolean = false
  //#region Validate
  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
  validatePhoneNumber(phoneNumber: string): boolean {
    const re = /^(09|03|07|08|05)+([0-9]{8})$/;
    return re.test(phoneNumber);
  }
  validPhone() {
    if (this.phone_number.length === 0) {
      this.validPhone_number = "Phone not blank !"
      return
    }
    if (!this.validatePhoneNumber("0" + this.phone_number)) {
      this.validPhone_number = "Phone not format !"
      return
    }
    this.validPhone_number = ""
    this.username = this.phone_number

  }
  validMail() {
    if (this.email.length === 0) {
      this.validEmail = "Email not blank !"
      return
    }
    if (!this.validateEmail(this.email)) {
      this.validEmail = "Email not format !"
      return
    }
    this.validEmail = ""
  }
  validatePassword() {

    if (this.password.length === 0) {
      this.validPassword = "Password not blank !"
      return
    }
    if (this.password.length <= 8) {
      this.validPassword = "Password short!"
      return
    }
    this.validPassword = ""
  }
  validateRePassword() {
    if (this.rePassword != this.password) {
      this.validRePassword = "Re - Password not equal password !"
      return
    }
    this.validRePassword = ""
  }
  async validate() {
    if (this.validEmail.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: ${this.validEmail}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validPhone_number.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: ${this.validPhone_number}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validPassword.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: ${this.validPassword}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validRePassword.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: ${this.validRePassword}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.username.length == 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Create ERROR',
        text: `Error: User not empty`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    return false
  }
  //#endregion 
  ngOnInit(): void {
    this.urlLastValue = this.url.substring(this.url.lastIndexOf('/') + 1);
    if (!isNaN(Number(this.urlLastValue))) {
      // await this.getUserUpdateInit(this.urlLastValue)
      this.ID = this.urlLastValue
      this.contentHeader = {
        headerTitle: 'User',
        actionButton: false,
        breadcrumb: {
          type: '',
          links: [
            {
              name: 'List',
              isLink: true,
              link: '/user'
            },
            {
              name: 'Edit',
              isLink: false
            },
            {
              name: this.ID,
              isLink: false
            }
          ]
        }
      };
    }
    else {
      this.contentHeader = {
        headerTitle: 'User',
        actionButton: false,
        breadcrumb: {
          type: '',
          links: [
            {
              name: 'List',
              isLink: true,
              link: '/user'
            },
            {
              name: 'Add',
              isLink: false
            },

          ]
        }
      };
    }
    // content header

  }
  //#region  create user
  username: string = ""
  async create() {
    const ck = await this.validate()
    if (ck) {
      return
    }
    const data = {
      password: this.password,
      username: this.username,
      full_name: this.first_name + " " + this.last_name,
      email: this.email,
      phone: "+84" + this.phone_number,
      verified_phone: this.verified_phone,
      verified_email: this.verified_email
    }
    this.isLoading = true
    const res = await this.userService.create(data)
    this.isLoading = false
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Create Success',
        text: `Create User ID: ${res.data.ID}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      this.router.navigate(['/user']);
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



  }
  //#endregion
  update() {
    console.log("Update data!")
  }
}
