import {Component, OnInit, Output} from "@angular/core";
import {OrdersService} from "../orders.service";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, FormArray} from "@angular/forms";

@Component({
  selector: 'order-form',
  template : `
  <div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="margin-20">
        <h4>Add customer</h4>
      </div>
      <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
        <div class="form-group col-xs-3">
          <label>Phone</label>
          <input type="text" phone formControlName="phone" (rawChange)="rawPhone=$event" class="form-control">
        </div>
        <div class="form-group col-xs-3">
          <label>Name</label>
          <input type="text" class="form-control" formControlName="name">
        </div>
        <div class="form-group col-xs-6">
          <label>Address</label>
          <input type="text" class="form-control" formControlName="address">
        </div>
        <div class="form-group">
          <label>P or D</label>
          <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="isPickup">
            <option value="P">Pick Up</option>
            <option value="D">Delivery</option>
          </select>
        </div>
        
        <div formArrayName="menus">
          <div *ngFor="let menu of myForm.controls.menus.controls; let i=index" class="panel panel-default">
            <div class="panel-heading">
              <span>Address {{i + 1}}</span>
              <span class="glyphicon glyphicon-remove pull-right" *ngIf="myForm.controls.menus.controls.length > 1" (click)="removeMenu(i)"></span>
            </div>
            <div class="panel-body" [formGroupName]="i">
              <order-menu [group]="myForm.controls.menus.controls[i]"></order-menu>
            </div>
          </div>
        </div>

        <div class="margin-20">
          <a class="btn btn-secondary" (click)="addMenu()" style="cursor: default">
            Add another menu +
          </a>
        </div>
        
        <div class="form-group col-xs-4">
          <label>Preparing Time</label>
          <input type="text" default="" class="form-control" formControlName="timeLeft">
        </div>
        <div class="form-group col-xs-8">
          <label>Description</label>
          <input type="text" class="form-control" formControlName="description">
        </div>
        
        <div class="margin-20">
          <button type="submit" class="btn btn-primary pull-right">Add Order !</button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
  </div>
  `
})
export class OrderFormComponent implements OnInit {

  myForm: FormGroup;

  constructor(private _fb: FormBuilder, private ordersService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      isPickup: [''],
      phone: [''],
      name: [''],
      address: [''],
      menus: this._fb.array([]),
      timeLeft: [''],
      description: ['']
    });

    this.addMenu();
  }

  initMenu() {
    return this._fb.group({
      type: [''],
      name: [''],
      size: [''],
      exclude: [''],
      extra: [''],
      pearl: ['']
    });
  }

  addMenu() {
    const control = <FormArray>this.myForm.controls['menus'];
    const menuCtrl = this.initMenu();

    control.push(menuCtrl);
  }

  removeMenu(i: number) {
    const control = <FormArray>this.myForm.controls['menus'];
    control.removeAt(i);
  }

  onSubmit(form: any) {
    this.ordersService.addOrder(form).subscribe();
    this.router.navigateByUrl('/finished');
  }

}
