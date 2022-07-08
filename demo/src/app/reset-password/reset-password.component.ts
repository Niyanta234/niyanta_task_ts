import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { samePass } from '../password--validator';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  
  resetPassword !: FormGroup;
  
  constructor(private auth:AuthService,private router:Router,private route:ActivatedRoute,private fb:FormBuilder) { 
   
  }

  ngOnInit(): void {
   
    this.resetPassword = this.fb.group({
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(8)]}),
      confirmpass: new FormControl('', { validators: [Validators.required] }),
    },
    { validators: samePass() }
  
    );
   
  }
  
  reset(){
    
    if(this.resetPassword.invalid){
      this.resetPassword.markAllAsTouched();
      return;
      }
    this.auth.reset_pass({password:this.resetPassword.value,token:this.route.snapshot.params['token']})
    .subscribe(res=>{
      // console.log(res);
      alert("Password changed successfully..!!");
      this.router.navigateByUrl('/signUp');
    },(err)=>{
      console.log(err)
      alert("try again..");
      // console.log(err);

    })
  }

}
