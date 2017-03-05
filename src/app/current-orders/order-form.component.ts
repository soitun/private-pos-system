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
        <div class="form-group">
          <label>Phone</label>
          <input type="text" class="form-control" formControlName="phone">
        </div>
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" formControlName="name">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" class="form-control" formControlName="address">
        </div>
        
        <!--addresses-->
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
          <a (click)="addMenu()" style="cursor: default">
            Add another menu +
          </a>
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <input type="text" class="form-control" formControlName="description">
        </div>
        
        <div class="margin-20">
          <button type="submit" class="btn btn-primary pull-right">Submit</button>
        </div>
        <div class="clearfix"></div>

        <div class="margin-20">
          <div>myForm details:-</div>
          <pre>form value: <br>{{myForm.value | json}}</pre>
        </div>
      </form>
    </div>
  </div>
  </div>
  `
})
export class OrderFormComponent implements OnInit {

  public myForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      phone: [''],
      name: [''],
      address: [''],
      menus: this._fb.array([]),
      description: ['']
    });

    // add address
    this.addMenu();

    /* subscribe to addresses value changes */
    // this.myForm.controls['addresses'].valueChanges.subscribe(x => {
    //   console.log(x);
    // })
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

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeMenu(i: number) {
    const control = <FormArray>this.myForm.controls['menus'];
    control.removeAt(i);
  }

  onSubmit(form: any) {
    console.log(form.value);
    console.log(form.value.menus);
    console.log(form.value.menus[0]);
  }

}
