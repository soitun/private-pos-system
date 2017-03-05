import {Component, Input} from "@angular/core";
import {OrdersService} from "../orders.service";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'order-menu',
  template : `
  <div [formGroup]="menuForm">
    <div class="form-group col-xs-6">
        <label>Type</label>
        <!--<input type="text" class="form-control" formControlName="type">-->
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="type">
          <option selected>Choose...</option>
          <option value="pizza">Pizza</option>
          <option value="side">Side or BBT</option>
        </select>
    </div>
    <div *ngIf="menuForm.controls.type.value == 'pizza'">
      <div class="form-group col-xs-6">
        <label>Pizza</label>
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="name">
          <option *ngFor="let pizza of pizzas" value="{{ pizza }}">{{ pizza }}</option>
        </select>
      </div>
      <label>Size</label>
      <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="size">
        <option value="M">Medium</option>
        <option value="L">Large</option>
      </select>
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
      <div class="form-group col-xs-6">
        <label>BBT/Side</label>
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="name">
          <option *ngFor="let side of sides" value="{{ side }}">{{ side }}</option>
        </select>
      </div>
      <div class="form-group col-xs-6">
        <label>Pearls</label>
        <!--<input type="text" class="form-control" formControlName="exclude">-->
        <select class="custom-select mb-2 mr-sm-2 mb-sm-0" formControlName="pearl">
          <option *ngFor="let pearl of pearls" value="{{ pearl }}">{{ pearl }}</option>
        </select>
      </div>   
    </div>
  </div>
  `
})
export class OrderMenuComponent {

  @Input('group')
  public menuForm: FormGroup;

  pizzas: any[] = ["Peperoni", "Cheese", "Supreme", "Hawaiian", "Vegetarian", "Greek",
    "Mexican", "Meat Lover", "Chicken", "Custom", "Sweet Potato"];

  sides: any[] = ["Strawberry", "Pina Colada"];

  pearls: any[] = ["Pearl", "Mango Jelly", "Coconut Jelly", "Half Pearl", "Half Mango Jelly",
    "Half Coconut Jelly", "Double Pearl", "Double Mango Jelly", "Double Coconut Jelly"];

}
