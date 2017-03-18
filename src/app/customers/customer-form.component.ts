import {Component, OnInit} from '@angular/core';
import {CustomersService} from "../customers.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'customer-form',
  template : `
  <div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="margin-20">
        <h4>Add customer</h4>
      </div>
      <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" formControlName="name">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" phone formControlName="phone" (rawChange)="rawPhone=$event" class="form-control">
        </div>
        <div class="form-group">
          <label>Address</label>
          <input type="text" class="form-control" formControlName="address">
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" class="form-control" formControlName="description">
        </div>
        
        <div class="margin-20">
          <button type="submit" class="btn btn-primary pull-right">Add Customer</button>
        </div>
        <div class="clearfix"></div>

      </form>
    </div>
  </div>
  </div>
  `
})
export class CustomerFormComponent implements OnInit {

  myForm: FormGroup;

  constructor(private _fb: FormBuilder, private customersService: CustomersService, private router: Router) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      name: [''],
      phone: [''],
      address: [''],
      description: ['']
    });
  }

  onSubmit(form: any): void{
    this.customersService.addCustomer(form).subscribe(data => {
      this.router.navigateByUrl('/customers');
    });
  }

}
