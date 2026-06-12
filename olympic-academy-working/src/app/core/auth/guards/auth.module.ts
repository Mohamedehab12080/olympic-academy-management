import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../auth/pages/login/login.component';
import { RegisterComponent } from '../../../core/auth/pages/register/register.component';
import { ForgotPasswordComponent } from '../../auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../auth/pages/reset-password/reset-password.component';
import { ActivateAccountComponent } from '../../auth/pages/activate-account/activate-account.component';

@NgModule({
  imports: [
    // Import standalone components here
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ActivateAccountComponent,
    RouterModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ActivateAccountComponent
  ]
})
export class AuthModule { }