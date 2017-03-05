import { Component, OnInit } from '@angular/core';
import {OrdersService} from "../orders.service";

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.ordersService.getCurrentOrders().subscribe(orders => {
      this.orders = orders;
    })
  }

}
