import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomersService} from "../customers.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'customer-edit',
  template : `
  <div class="col-xs-12">
    <div class="jumbotron">
      <h2>Edit Customer</h2>
      <form #form="ngForm" (ngSubmit)="submitForm(form.value)">
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" placeholder="Name" name="name" value="{{customer.name}}" ngModel>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" class="form-control" placeholder="Name" name="phone" value="{{customer.phone}}" ngModel>
          <small>Must Be Form of 000-000-0000</small>
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
          <button type="submit" class="btn btn-success">Submit</button>
        </div>
      </form>
    </div>
  </div>
  `
})

export class CustomerEditComponent implements OnInit{

  _custId: any = "";
  customer: any = "";


  constructor(private _fb: FormBuilder, private customersService: CustomersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this._custId = params['id'];
    });

    this.customersService.getCustomer(this._custId).subscribe(customer => {
      this.customer = customer;
    });

  };

  submitForm(form: any): void{
    this.customersService.updateCustomer(this._custId, form).subscribe(data => {
      this.router.navigateByUrl('/customers/' + this._custId);
    });
  }



}
