import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators ,FormBuilder,ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { samePass } from '../password--validator'


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  isSignUp:boolean = false;
  isLogin:boolean = true;
 
  loginform!:FormGroup;
  signupform!:FormGroup;
  constructor(private auth:AuthService, private fb: FormBuilder  ,private router:Router) {
  
  }
  
ngOnInit(): void {
  // console.log(samePass());
  this.signupform = this.fb.group(
    {
      email: new FormControl('', { validators: [Validators.required,Validators.email] }),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(8)]}),
      fullName: new FormControl('', { validators: [Validators.required] }),
      mobileNo: new FormControl('', {validators: [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999),
        ],
      }),
      confirmpass: new FormControl('', { validators: [Validators.required] }),
    },
    { validators: samePass() }
  );

this.loginform = new FormGroup({
  'email':new FormControl('',[Validators.required, Validators.email]),
  'password':new FormControl('',[Validators.required,Validators.minLength(8)]),
})


}




signUp(){
  // console.log(this.signupform)
  if(this.signupform.invalid){
    this.signupform.markAllAsTouched();
    return;
    }
  this.auth.btn_signup(this.signupform.value)
  .subscribe(res=>{
    this.isLogin=true;
    this.isSignUp=false;
    // console.log(res);
    alert("Registered successfully..!!")

  },(err)=>{
    
    // console.log(err);
    alert(err.error.error)
  })

}

async signIn(){
  if(this.loginform.invalid){
    this.loginform.markAllAsTouched();
    return;
    }
  await this.auth.btn_signin(this.loginform.value)
  .subscribe(res=>{
    // console.log(res);
    this.router.navigateByUrl('/setprofile');
  },(err)=>{
    // console.log(err);
    if(err.error.error=="Invalid Password"){
      alert("Invalid Password")
    }else if(err.error.error=="Invalid Email"){
      alert("Invalid Email");
      this.isSignUp=true;
      this.isLogin=false;
    }
    else{
      alert("please check your email id this user is not registered");
      this.isSignUp=true;
      this.isLogin=false;
    }
    
    
  })
  
}
  
 signin(){
    this.isLogin=true;
    this.isSignUp=false;
 }
 signup(){
  this.isSignUp=true;
  this.isLogin=false;
    }
  }