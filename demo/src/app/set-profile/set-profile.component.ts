import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css']
})
export class SetProfileComponent implements OnInit {
  setprofileform!: FormGroup;
  formData:any;
  
  constructor(private auth: AuthService,private route:Router) {}

  ngOnInit(): void {
    this.formData =new FormData();
    this.setprofileform = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required,Validators.min(100000),Validators.max(999999)]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      LGA: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      DailyWages: new FormControl('', [Validators.required]),
      degreeDetails: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      edu_certificate:new FormControl('',[Validators.required]),
      training_certificate:new FormControl('',[Validators.required])
    });
    this.persons.forEach((person) => {
      this.setprofileform.addControl(
        person,
        new FormControl('', [Validators.required])
      );
    });
  }

  
  imagePath: any;
  url: any;
  onFileChanged(event: any) {
    console.log(event.target.files[0])
    this.formData.delete('avatar')
    this.formData.append('avatar',event.target.files[0])
    const files = event.target.files;
    if (files.length === 0) return;

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
  }

  educertifile: any;
  trainingfile: any;
  

  educertificate(event: any) {
    this.educertifile = <File>event.target.files[0];
    this.formData.delete('degreeUpload')
    this.formData.append('degreeUpload',event.target.files[0])
  }

  traningcertificate(event: any) {
    this.trainingfile = <File>event.target.files[0];
    this.formData.delete('certificateUpload')
    this.formData.append('certificateUpload',event.target.files[0])
    console.log(this.trainingfile);
  }

  designations = ['Juniar', 'Intermidiate', 'Senior', 'Lead'];
  persons = ['Welder', 'Fitter', 'Wigger', 'Sactfolder'];
  skillSets: any = {};

  changeSelection(person: any, designation: any, event: any) {
    this.skillSets[person] = designation;
  }

  submitData() {
    
    if(this.setprofileform.invalid){
      this.setprofileform.markAllAsTouched();
      return;
      }
    
    let data = this.setprofileform.value;
    
  
    
    data.address = {};
    data.address['addressLine1'] = this.setprofileform.value.addressLine1;
    data.address['addressLine2'] = this.setprofileform.value.addressLine2;
    
    data.address['postalCode'] = this.setprofileform.value.postalCode;
    
    data.address['city'] = this.setprofileform.value.city;
    
    data.address['state'] = this.setprofileform.value.state;
    data.address['LGA'] = this.setprofileform.value.LGA;
    data.address['country'] = this.setprofileform.value.country;
    data.address['DailyWages'] = this.setprofileform.value.DailyWages;
    
    data.skillSetsAndTrade = {};
    data.skillSetsAndTrade["skillSets"] = {};     
    Object.keys(this.skillSets).forEach((key) => {
      data.skillSetsAndTrade["skillSets"][key] = this.skillSets[key];
    });
    
    this.formData.append('data',JSON.stringify(data))
    
    this.auth.set_profile(this.formData)
    .subscribe(res=>{
      this.formData=null;
      // console.log(res);
      alert("Set profile Successfully!!")
      this.route.navigateByUrl('/addpayment')
    },(err)=>{
      this.formData=null;
      console.log(err)
      alert(err.error.message);
      // console.log(err);
    })
  }
}