import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
})
export class PaymentHistoryComponent implements OnInit {
  paymentHistory: any = [];

  constructor(private auth: AuthService, private route: Router) {}

  currentPage = 1;
  itemsPerPage = 3;
  totalItems = 0;

  sortBy = 'fullName';
  isReverse = false;

  ngOnInit(): void {
    this.getHistory();
  }

  changePage(pageNo: any) {
    this.currentPage = pageNo;
    this.getHistory();
  }

  sort(key: string) {
    if (this.sortBy == key) {
      this.isReverse = !this.isReverse;
    } else {
      this.sortBy = key;
    }
    this.getHistory();
  }

  getHistory() {
    const queryParams = {
      itemsPerPage: this.itemsPerPage,
      pageNo: this.currentPage,
      sortBy: this.sortBy,
      reverse: this.isReverse,
    };
    this.auth.viewhistory(queryParams).subscribe(
      (data: any) => {
        console.log(data);
        this.paymentHistory = data.results;
        this.totalItems = data.count;
      },
      (err) => {
        if (err.status == 401) {
          this.route.navigate(['/signUp']);
        }
        console.log(err);
      }
    );
  }
}
