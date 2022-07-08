import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetProfileComponent } from './set-profile/set-profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'user/resetpassword/:token', component: ResetPasswordComponent },
  { path: 'setprofile', component: SetProfileComponent },
  { path: 'paymenthistory', component: PaymentHistoryComponent },
  { path: 'addpayment', component: AddPaymentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
