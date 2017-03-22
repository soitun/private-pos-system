import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {OrdersService} from "../orders.service";
import {Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";

@Component({
  selector: 'order-menu',
  template : `
  <div [formGroup]="menuForm">
    <div class="form-group col-xs-4">
        <label>Type</label>
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="type">
          <option value="pizza">Pizza</option>
          <option value="side">Side or BBT</option>
        </select>
    </div>
    <div *ngIf="menuForm.controls.type.value == 'pizza'">
      <div class="form-group col-xs-4">
        <label>Pizza</label>
        <ng-select
          [options]="pizzaOptions"
          [multiple]="false"
          placeholder="Select one"
          formControlName="name"
          [allowClear]="true"
          (opened)="onSingleOpened()"
          (closed)="onSingleClosed()"
          (selected)="onSingleSelected($event)"
          (deselected)="onSingleDeselected($event)">
        </ng-select>
      </div>
      <div class="form-group col-xs-4">
      <label>Size</label>
      <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="size">
        <option value="M">Medium</option>
        <option value="L">Large</option>
      </select>
      </div>
      <div class="form-group col-xs-6">
        <label>Exclude</label>
        <input type="text" class="form-control" formControlName="exclude">
      </div>  
      <div class="form-group col-xs-6">
        <label>Extra</label>
        <input type="text" class="form-control" formControlName="extra">
      </div>  
    </div>
    <div *ngIf="menuForm.controls.type.value == 'side'">
      <div class="form-group col-xs-4">
        <label>BBT/Side</label>
        <ng-select
          [options]="sideOptions"
          [multiple]="false"
          placeholder="Select one"
          formControlName="name"
          [allowClear]="true"
          (opened)="onSingleOpened()"
          (closed)="onSingleClosed()"
          (selected)="onSingleSelected($event)"
          (deselected)="onSingleDeselected($event)">
        </ng-select>
      </div>

      <div class="form-group col-xs-4">
        <label>Pearls</label>
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="pearl">
          <option *ngFor="let pearl of pearls" value="{{ pearl }}">{{ pearl }}</option>
        </select>
      </div>   
    </div>
  </div>
  `
})
export class OrderMenuComponent implements OnInit {

  @Input('group')
  public menuForm: FormGroup;

  pizzas: any[] = ["Peperoni", "Cheese", "Supreme", "Vegetarian", "Hawaiian", "Greek",
    "Mexican", "Meat Lover", "Chicken", "Canadian", "Sweet Potato", "Custom"];

  sides: any[] = ["Taro Smoothie", "HoneyDew Smoothie", "Lychee Smoothie", "Pineapple Smoothie", "Chocolate Smoothie",
    "Chocolate Taro Smoothie", "Lychee GreenApple Smoothie", "Grape Smoothie", "Grape Orange Smoothie",
    "Lychee Peach Smoothie", "Pina Colada Smoothie", "Strawberry Smoothie", "Strawberry Raspberry Smoothie",
    "Blueberry Smoothie", "Blueberry Raspberry Smoothie", "Strawberry Blueberry Smoothie", "Strawberry Banana Smoothie",
    "Mango Smoothie", "Mango Raspberry Smoothie", "Strawberry Mango Smoothie", "Kiwi Smoothie", "GreenApple Smoothie",
    "Pineapple Smoothie", "Peach Smoothie", "Peach Raspberry Smoothie", "Peach GreenApple Smoothie", "Kiwi Raspberry Smoothie",
    "Strawberry Taro Smoothie", "Mango GreenApple Smoothie", "Orange Smoothie", "Coconut Smoothie", "Oreo Twist Smoothie", "Taro Milk Tea",
    "Honeydew Milk Tea", "Coconut Milk Tea", "Mango Milk Tea", "GreenApple Milk Tea", "Grape Milk Tea", "Peach Milk Tea", "Chocolate Milk Tea",
    "Pineapple Milk Tea", "Regular Milk Tea", "Regular Green Tea", "Regular Black Tea", "Milk Black Tea", "Milk Green Tea", "Lemon Green Tea",
    "Honey Green Tea", "Honey Lemon Green Tea", "Mango Green Tea", "GreenApple Green Tea", "Grape Green Tea", "Peach Green Tea",
    "Lychee Green Tea", "Honey Milk Green Tea", "Red Black Tea", "Lemon Black Tea", "Honey Black Tea", "Honey Lemon Black Tea",
    "Mango Black Tea", "GreenApple Black Tea", "Grape Black Tea", "Peach Black Tea", "Pineapple Black Tea", "Lychee Black Tea", "Caesar Salad", "Chicken Wings"];

  pearls: any[] = ["No Pearl", "Pearl", "Mango Jelly", "Coconut Jelly", "Half Pearl", "Half Mango Jelly",
    "Half Coconut Jelly", "Double Pearl", "Double Mango Jelly", "Double Coconut Jelly"];

  pizzaOptions: Array<any> = [];
  sideOptions: Array<any> = [];

  constructor() {

    let numPizzaOptions = this.pizzas.length;
    let opts = new Array(numPizzaOptions);

    for (let i = 0; i < numPizzaOptions; i++) {
      opts[i] = {
        value: this.pizzas[i],
        label: this.pizzas[i]
      };
    }

    let numSideOptions = this.sides.length;
    let opts2 = new Array(numSideOptions);

    for (let i = 0; i < numSideOptions; i++) {
      opts2[i] = {
        value: this.sides[i],
        label: this.sides[i]
      };
    }

    this.pizzaOptions = opts.slice(0);
    this.sideOptions = opts2.slice(0);
  }

  ngOnInit() {
  }

  onSingleOpened() {
  }

  onSingleClosed() {
  }

  onSingleSelected(item) {
  }

  onSingleDeselected(item) {
  }

}


