import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomersService} from "../customers.service";

@Component({
  selector: 'customer-edit',
  template : `
    <div class="jumbotron">
    <h2>Template Driven Form</h2>
    <form #form="ngForm" (ngSubmit)="submitForm(form.value)">
      <div class="form-group">
        <label>Name</label>
        <input type="text" class="form-control" placeholder="Name" name="name" value="{{customer.name}}" ngModel>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" class="form-control" placeholder="Name" name="phone" value="{{customer.phone}}" ngModel>
      </div>
      <div class="form-group">
        <label>Address</label>
        <input type="text" class="form-control" placeholder="Name" name="address" value="{{customer.address}}" ngModel>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" class="form-control" placeholder="Name" name="description" value="{{customer.description}}" ngModel>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-default">Submit</button>
      </div>
    </form>
    <div class="row" *ngFor="let order of orders">
      <div class="card card-block">
        <h4 class="card-title">{{ order.name }}</h4>
        <p class="card-text">{{ order.phone }}</p>
        <p class="card-text">{{ order }}</p>
      </div>
    </div>
  </div>
  `
})

export class CustomerEditComponent implements OnInit{

  _custId: any = "";
  customer: any = "";
  orders: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private customersService: CustomersService) { }

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

  submitForm(form: any): void{
    console.log('Form Data: ');
    console.log(form);
    this.customersService.updateCustomer(this._custId, form).subscribe();
    this.router.navigateByUrl('/customers/' + this._custId);
  }



}
