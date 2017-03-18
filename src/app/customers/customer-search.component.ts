import {Component, OnInit} from "@angular/core";
import {CustomersService} from "../customers.service";
import {Router} from "@angular/router";

@Component({
  selector: 'customer-search',
  template : `
      <div class="jumbotron">
        <h2>Template Driven Form</h2>
        <form #form="ngForm" (ngSubmit)="submitForm(form.value)">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" placeholder="Name" name="name" ngModel>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" class="form-control" placeholder="Name" name="phone" ngModel>
          </div>
          <div class="form-group">
            <label>Address</label>
            <input type="text" class="form-control" placeholder="Name" name="address" ngModel>
          </div>
          <div class="form-group">
            <label>Description</label>
            <input type="date" class="form-control" placeholder="Date" name="date" ngModel>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-default">Submit</button>
          </div>
        </form>
      </div>
  `
})

export class CustomerSearchComponent {

  items: any[] = [];

  constructor(private customersService: CustomersService, private router: Router) { }

  submitForm(form: any): void{
  }

}
