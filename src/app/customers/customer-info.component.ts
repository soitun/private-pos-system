import {Component, OnInit} from '@angular/core';
import {CustomersService} from "../customers.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'customer-info',
  template : `
    <div class="container">
    <div class="card card-block">
      <h4 class="card-title">{{ customer.name }}</h4>
      <p class="card-text">{{ customer.phone }}</p>
      <p class="card-text">{{ customer.address }}</p>
      <p class="card-text">{{ customer.description }}</p>
      <a [routerLink]="['/orders']" class="card-link">Order List</a>
      <a [routerLink]="['/customers']" class="card-link">Customer List</a>
      <a [routerLink]="['/customers/edit', customer._id]" class="card-link">Edit</a>
    </div>
    <div class="row" *ngFor="let order of orders">
      <div class="card card-block">
        <h4 class="card-title">{{ order.name }}</h4>
        <p class="card-text">{{ order.phone }}</p>
      </div>
    </div>
    </div>
  `
})

export class CustomerInfoComponent implements OnInit{

  _custId: any = "";
  customer: any = "";
  orders: any[] = [];

  constructor(private route: ActivatedRoute, private customersService: CustomersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._custId = params['id'];
    });

    this.customersService.getCustomer(this._custId).subscribe(customer => {
      this.customer = customer;
    });

    this.customersService.getCustomerOrders(this._custId).subscribe(orders => {
      this.orders = orders;
    });
  }

}
