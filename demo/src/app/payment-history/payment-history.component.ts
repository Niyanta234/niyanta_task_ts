import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  paymenthistorylistarr: any = [];

  constructor(private auth: AuthService) { }
  
  currentpage: number = 1;


  ngOnInit(): void {
    this.auth.viewhistory(this.currentpage).subscribe((data:any) => {
      // console.log(data)
      this.paymenthistorylistarr = data.results;
      console.log(this.paymenthistorylistarr)

    })

  

  }
  key:any='fullName';
  reverse:boolean=false;
  sort(key){
    // console.log(key);
   this.key=key;
   this.reverse=!this.reverse;
  }

}
