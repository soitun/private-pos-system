import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {OrdersService} from "../orders.service";
import {FormGroup, FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  menus: any[] = [];
  myForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private ordersService: OrdersService) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      phone: [''],
      address: ['']
    });

    this.ordersService.getOrders().subscribe(objs => {
      this.orders = objs[0];
      this.menus = objs[1];
    })
  }

  onSubmit(form: any) {
    this.ordersService.SearchOrders(form).subscribe(data => {
      this.orders = data[0];
      this.menus = data[1];
    })
  }

}




