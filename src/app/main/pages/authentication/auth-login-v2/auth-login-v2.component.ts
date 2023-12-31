import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { Role, User } from 'app/api/auth/models';
import { AuthenticationService } from 'app/api/auth/service/authentication.service'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationServices: AuthenticationService,
    private _toastrService: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const body = {
      username: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    this.loading = true;
    const dataLogin = await this._authenticationServices.login(body.username, body.password)
    console.log('login services',dataLogin)
    this.loading = false;
    
    if (dataLogin.check === 'OK') {
      localStorage.setItem('accessToken', dataLogin.data.accessToken)
      localStorage.setItem('refreshToken', dataLogin.data.refreshToken)
      let user: User = {
        id: 1,
        email: "nguyenkhang1400@gmail.com",
        full_name: "China",
        avatar: 'avatar-s-11.jpg',
        role: Role.Admin
      }
      this._toastrService.success(
        'You have successfully logged in as an ' +
        user.role +
        ' user to Identity System. Now you can start to explore. Enjoy! 🎉',
        '👋 Welcome, ' + user.full_name + '!',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this._router.navigate([this.returnUrl]);
    }
    else {
      this._toastrService.error(
        'Error: ' + dataLogin.data,
        'Login Failed !',
        { toastClass: 'toast ngx-toastr', closeButton: true }
      );
    }
    // Login
  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
