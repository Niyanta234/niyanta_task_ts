import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../loader/loader.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-set-profile',
  templateUrl: './set-profile.component.html',
  styleUrls: ['./set-profile.component.css'],
})
export class SetProfileComponent implements OnInit {
  setprofileform!: FormGroup;
  formData: any;

  constructor(
    private auth: AuthService,
    private route: Router,
    private loader: LoaderService
  ) {
    this.loader.show();
  }

  isUpdateReq = false;
  ngOnInit(): void {
    this.formData = new FormData();
    this.setprofileform = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      address: new FormGroup({
        addressLine1: new FormControl('', [Validators.required]),
        addressLine2: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [
          Validators.required,
          Validators.min(100000),
          Validators.max(999999),
        ]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        LGA: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        DailyWages: new FormControl('', [Validators.required]),
      }),
      degreeDetails: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      edu_certificate: new FormControl('', [Validators.required]),
      training_certificate: new FormControl('', [Validators.required]),
      skillSetsAndTrade: new FormControl('', [Validators.required]),
    });

    // fill data if already set profile done

    this.auth.get_profile().subscribe(
      (data) => {
        if (data.success) {
          this.isUpdateReq = true;
          this.url = data.profile?.avatar?.url;

          let { dateOfBirth, address, degreeDetails, desc, skillSetsAndTrade } =
            data.profile;
          this.skillSets = skillSetsAndTrade.skillSets;
          if(this.skillSets){
            this.setprofileform.get('skillSetsAndTrade')?.setErrors(null)
            }
          dateOfBirth = dateOfBirth.split('T')[0];
          this.setprofileform.patchValue({
            dateOfBirth,
            address,
            degreeDetails,
            desc,
          });

          this.setprofileform.get('avatar')?.clearValidators();
          this.setprofileform.get('avatar')?.setErrors(null);
          this.setprofileform.get('avatar')?.updateValueAndValidity();

          this.setprofileform.get('edu_certificate')?.clearValidators();
          this.setprofileform.get('edu_certificate')?.setErrors(null);
          this.setprofileform.get('edu_certificate')?.updateValueAndValidity();

          this.setprofileform.get('training_certificate')?.clearValidators();
          this.setprofileform.get('training_certificate')?.setErrors(null);
          this.setprofileform
            .get('training_certificate')
            ?.updateValueAndValidity();
        }
        this.loader.hide();
      },
      (err) => {
        if (err.status == 401) {
          this.route.navigate(['/signUp']);
        }
        this.loader.hide();
        console.log(err);
      }
    );
  }

  url = '../assets/images/user.svg';
  onFileChanged(event: any) {
    console.log(event.target.files[0]);
    this.formData.delete('avatar');
    this.formData.append('avatar', event.target.files[0]);
    const files = event.target.files;
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result as string;
    };
  }

  educertifile: any;
  trainingfile: any;

  educertificate(event: any) {
    this.educertifile = <File>event.target.files[0];
    this.formData.delete('degreeUpload');
    this.formData.append('degreeUpload', event.target.files[0]);
  }

  traningcertificate(event: any) {
    this.trainingfile = <File>event.target.files[0];
    this.formData.delete('certificateUpload');
    this.formData.append('certificateUpload', event.target.files[0]);
    console.log(this.trainingfile);
  }

  designations = ['Juniar', 'Intermidiate', 'Senior', 'Lead'];
  persons = ['Welder', 'Fitter', 'Wigger', 'Sactfolder'];
  skillSets: any = {};

  changeSelection(person: any, designation: any, event: any) {
    this.skillSets = {};
    if (event.target.checked) {
      this.skillSets[person] = designation;
    }
  }

  submitData() {
    if (this.setprofileform.invalid) {
      console.log('invalid', this.setprofileform);
      this.setprofileform.markAllAsTouched();
      return;
    }

    console.log(this.setprofileform);
    let data = this.setprofileform.value;
    data.skillSetsAndTrade = {};
    data.skillSetsAndTrade['skillSets'] = this.skillSets;

    this.formData.delete('data');
    this.formData.append('data', JSON.stringify(data));

    this.loader.show();
    this.auth.set_profile(this.formData).subscribe(
      (res) => {
        this.loader.hide();
        this.formData = null;
        // console.log(res);
        alert('Set profile Successfully!!');
        this.route.navigateByUrl('/addpayment');
      },
      (err) => {
        this.loader.hide();
        console.log(err);
        alert(err.error.message);
        // console.log(err);
      }
    );
  }
}
