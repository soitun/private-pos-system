import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {OrdersService} from "../orders.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'order-edit',
  template : `
  <div class="col-xs-12">
    <div class="jumbotron">
      <h2>Edit Order</h2>
      <form #form="ngForm" (ngSubmit)="submitForm(form.value)">
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" placeholder="Name" name="name" value="{{order.name}}" ngModel>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" class="form-control" placeholder="Phone" name="phone" value="{{order.phone}}" ngModel>
          <small>Must Be Form of 000-000-0000</small>
        </div>
        <div class="form-group" *ngIf="!order.isPickup">
          <label>Address</label>
          <input type="text" class="form-control" placeholder="Address" name="address" value="{{order.address}}" ngModel>
        </div>
        <div class="form-group">
          <label *ngIf="!order.isFinished">Time Left</label>
          <input type="{{order.isFinished ? 'hidden' : 'text'}}" class="form-control" placeholder="timeLeft" name="timeLeft" value="" ngModel>
        </div>
        <div class="form-group">
          <label>Additional Info</label>
          <input type="text" class="form-control" placeholder="addInfo" name="addInfo" value="{{order.addInfo}}" ngModel>
        </div>
        <div class="form-group col-xs-6">
          <label>P or D</label>
          <select class="form-control" name="isPickup" ngModel>
            <option value="P">Pick Up</option>
            <option value="D">Delivery</option>
          </select>
        </div>
        <div class="form-group col-xs-6">
          <label>Finished?</label>
          <select class="form-control" name="isFinished" ngModel>
            <option value="T">Yes</option>
            <option value="F">No</option>
          </select>
        </div>
        <label>Finish Time: {{ order.finishTime | date: 'short' }}</label>
        <div *ngFor="let pizza of menu.pizzaObjs">
          <div *ngIf="pizza.exclude && pizza.extra">
            <p>{{pizza.size}} {{ pizza.name }}, No: {{ pizza.exclude }}, Extra: {{ pizza.extra }}</p>
          </div>
          <div *ngIf="pizza.exclude && !pizza.extra">
            <p>{{pizza.size}} {{ pizza.name }}, No: {{ pizza.exclude }}</p>
          </div>
          <div *ngIf="!pizza.exclude && pizza.extra">
            <p>{{pizza.size}} {{ pizza.name }}, Extra: {{ pizza.extra }}</p>
          </div>
          <div *ngIf="!pizza.exclude && !pizza.extra">
            <p>{{pizza.size}} {{ pizza.name }}</p>
          </div>
        </div>
        <div *ngFor="let side of menu.sideObjs">
          <p>{{ side.name }} with {{ side.pearl }}</p>
        </div>
        
        <div class="form-group">
          <button type="submit" class="btn btn-success">Update!</button>
        </div>
      </form>
    </div>
  </div>
  `
})

export class OrderEditComponent implements OnInit{

  _orderId: any = "";
  order: any = "";
  menu: any = [];


  constructor(private _fb: FormBuilder, private ordersService: OrdersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._orderId = params['id'];
    });

    this.ordersService.getOrder(this._orderId).subscribe(obj => {
      this.order = obj[0];
      this.menu = obj[1];
    });
  };

  submitForm(form: any): void{
    this.ordersService.updateOrder(this._orderId, form).subscribe(data => {
      this.router.navigateByUrl('/orders/' + this._orderId);
    });
  }



}
