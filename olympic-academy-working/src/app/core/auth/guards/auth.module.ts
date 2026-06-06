import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from '../../services/auth/auth-routing.module';
import { LoginComponent } from '../../services/auth/components/login/login.component';
import { RegisterComponent } from '../../services/auth/components/register/register.component';
import { ForgotPasswordComponent } from '../../services/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../services/auth/components/reset-password/reset-password.component';
import { ActivateAccountComponent } from '../../services/auth/components/activate-account/activate-account.component';
import { SharedModule } from './../../shared/shared.module'; // ← Import SharedModule

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ActivateAccountComponent
  ],
  imports: [
    SharedModule, // This provides CommonModule, FormsModule, ReactiveFormsModule
    RouterModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }