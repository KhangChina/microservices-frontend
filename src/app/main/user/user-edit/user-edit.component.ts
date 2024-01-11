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
  first_name: string = ""
  birthday: string = ""
  avatarImage: string = "";
  avatarImageID: string = ""
  //Validate
  validEmail = ""
  validPhone_number = ""
  validRePassword = ""
  validPassword = ""
  validUsername = ""
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
  validateUser() {
    if (this.username.length === 0) {
      this.validUsername = "User is not blank !"
      return
    }
    this.validUsername = ""
  }
  async validate() {
    this.validPhone()
    this.validMail()
    this.validatePassword()
    this.validateRePassword()
    this.validateUser()
    if (this.validEmail.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Validate ERROR',
        text: `Error validEmail: ${this.validEmail}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validPhone_number.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Validate ERROR',
        text: `Error validPhone_number: ${this.validPhone_number}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validPassword.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Validate ERROR',
        text: `Error validPassword: ${this.validPassword}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validRePassword.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Validate ERROR',
        text: `Error validRePassword: ${this.validRePassword}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    if (this.validUsername.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Validate ERROR',
        text: `Error validUsername: ${this.validUsername}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      return true
    }
    return false
  }
  //#endregion 
  async ngOnInit() {
    this.selectStatus = await this.userService.getUserStatus()
    this.urlLastValue = this.url.substring(this.url.lastIndexOf('/') + 1);
    if (!isNaN(Number(this.urlLastValue))) {
      //Init layout
      await this.UIUserUpdateInit(this.urlLastValue)
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
      //Init layout
      await this.UIUserCreateInit()
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
  }
  async UIUserUpdateInit(IDUser: any) {
    const res = await this.userService.getById(IDUser)
    if (res.check === "OK") {
      //Detach first_name and last_name
      this.splitName(res.data.full_name)
      //Get data from API
      this.email = res.data.email
      this.username = res.data.username
      if (res.data.phone.startsWith('+84')) {
        this.phone_number = res.data.phone.replace('+84', '')
      }
      this.verified_email = res.data.verified_email
      this.verified_phone = res.data.verified_phone
      //Show button
      this.btnCreateHide = true
      this.btnUpdateHide = false
      this.status = res.data.status
      this.textPassHide = true
      this.textRepassHide = true
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
  }
  async UIUserCreateInit() {
    this.btnCreateHide = false
    this.btnUpdateHide = true
    this.last_name = ""
    this.first_name = ""
    this.phone_number = ""
    this.email = ""
    this.verified_email = false
    this.verified_phone = false
  }
  splitName(fullName: string) {
    const nameParts = fullName.split(' ');
    this.last_name = nameParts.pop() || '';
    this.first_name = nameParts.join(' ');
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
  async update() {
    const data = {
      username: this.username,
      full_name: this.first_name + " " + this.last_name,
      email: this.email,
      phone: "+84" + this.phone_number,
      verified_phone: this.verified_phone,
      verified_email: this.verified_email,
      status: this.status
    }
    this.isLoading = true
    const res = await this.userService.update(this.ID, data)
    this.isLoading = false
    if (res.check === "OK") {
      await Swal.fire({
        icon: 'success',
        title: 'Update Success',
        text: `Create User ID: ${this.ID}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
      //this.router.navigate(['/user']);
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Update ERROR',
        text: `Error: ${JSON.stringify(res.data)}`,
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
    //console.log(data)
  }
  //#region Logic layout edit and add user
  onChangeUserName(type: string) {
    if (type === 'phone') {

      this.username = this.getUsernameFromPhone(this.phone_number)
    }
    else if (type === 'mail') {
      this.username = this.getUsernameFromEmail(this.email)
    }
    else {
      this.username = this.getUserNameFromName(this.first_name, this.last_name)
    }
  }
  getUsernameFromEmail(email: string) {
    if(email.length > 0)
    {
      const index = email.indexOf('@')
      if (index !== -1) {
        return email.substring(0, index)
      }
    }
    return ""
  }
  getUserNameFromName(first_name: string, last_name: string) {
    if(first_name.length  >0 && first_name.length>0)
    {
      const username = last_name.toLocaleLowerCase() + '.' + first_name.toLowerCase().replace(' ', '.')
      return username
    }
    return ""
  }
  getUsernameFromPhone(phone : string)
  {
    if(phone.length > 0)
    {
      return "0"+this.phone_number
    }
    return ""
  }
  //#endregion
}
