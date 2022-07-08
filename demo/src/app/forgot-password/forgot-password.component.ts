import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
 
  forgotPassword !: FormGroup;

  constructor(private auth:AuthService,private fb:FormBuilder,private router:Router) {
   
   }
   
  ngOnInit(): void {
    
    
    this.forgotPassword = new FormGroup({
      'email' : new FormControl('', [Validators.required, Validators.email]),

    })
    
    
    
    
  }
  forgot(){
    if(this.forgotPassword.invalid){
      this.forgotPassword.markAllAsTouched();
      return;
      }
    
    this.auth.forgot_pass(this.forgotPassword.value)
    .subscribe(res=>{
      // console.log(res);
      alert("check your gmail inbox");
    },(err)=>{
      // console.log(err);
      if(err.length!=0){
        alert("this user is not signup or check your email id")

      }
    })
  }
  
  
}
