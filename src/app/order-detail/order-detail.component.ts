import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "../orders.service";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  _id: any = "";
  order: any = "";

  constructor(private route: ActivatedRoute, private ordersService: OrdersService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._id = params['id'];
    });

    this.ordersService.getOrder(this._id).subscribe(order => {
      this.order = order;
    });

    // console.log("_id in Component: " + this._id);
    // console.log("order in Component: " + this.order);
  }

}
