import {Component, OnInit} from '@angular/core';
import {CustomersService} from "../customers.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'customer-info',
  template : `
    <div class="container">
      <div class="col-xs-12">
        <div class="card card-block">
          <div class="col-xs-8">
            <h4 class="card-title" *ngIf="customer.name">{{ customer.name }}, {{ customer.phone }}</h4>
            <h4 class="card-title" *ngIf="!customer.name">{{ customer.phone }}</h4>
          </div>
          <div class="col-xs-2 offset-xs-2">
            <a [routerLink]="['/customers/edit', customer._id]" class="btn btn-info btn-sm">Edit Customer</a>
          </div>
          <div class="col-xs-12">
            <p class="card-text">{{ customer.address }}</p>
            <p class="card-text">{{ customer.description }}</p>
            <a [routerLink]="['/customers']" class="card-link">Back To Customer List</a>
          </div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="row" *ngFor="let order of orders; let i = index;">
          <div class="card card-block">
            <div class="col-xs-8">
              <h4>{{ order.finishTime | date:'short' }}</h4>
            </div>
            <div class="col-xs-2 offset-xs-2">
              <a [routerLink]="['/orders', order._id]" class="btn btn-warning btn-sm">Order Detail</a>
            </div>
            <div class="col-xs-12">
              <div *ngFor="let pizza of menus[i].pizzaObjs">
                <div *ngIf="pizza.exclude && pizza.extra">
                  <p><b>{{pizza.size}} {{ pizza.name }}, No: {{ pizza.exclude }}, Extra: {{ pizza.extra }}</b></p>
                </div>
                <div *ngIf="pizza.exclude && !pizza.extra">
                  <p><b>{{pizza.size}} {{ pizza.name }}, No: {{ pizza.exclude }}</b></p>
                </div>
                <div *ngIf="!pizza.exclude && pizza.extra">
                  <p><b>{{pizza.size}} {{ pizza.name }}, Extra: {{ pizza.extra }}</b></p>
                </div>
                <div *ngIf="!pizza.exclude && !pizza.extra">
                  <p><b>{{pizza.size}} {{ pizza.name }}</b></p>
                </div>
              </div>
              <div *ngFor="let side of menus[i].sideObjs">
                <p><b>{{ side.name }} with {{ side.pearl }}</b></p>
              </div>
              <p><b>{{ order.addInfo }}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class CustomerInfoComponent implements OnInit{

  _custId: any = "";
  customer: any = "";
  orders: any[] = [];
  menus: any[] = [];

  constructor(private route: ActivatedRoute, private customersService: CustomersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._custId = params['id'];
    });

    this.customersService.getCustomer(this._custId).subscribe(customer => {
      this.customer = customer;
    });

    this.customersService.getCustomerOrders(this._custId).subscribe(objs => {
      this.orders = objs[0];
      this.menus = objs[1];
    });
  }

}
