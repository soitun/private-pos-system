import {Component, OnInit, ViewChild, ElementRef, Pipe, PipeTransform} from '@angular/core';
import {OrdersService} from "../orders.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-current-orders',
  templateUrl: './current-orders.component.html',
  styleUrls: ['./current-orders.component.css']
})
export class CurrentOrdersComponent implements OnInit {

  @ViewChild('input')
  input: ElementRef;
  orders: any[] = [];
  menus: any[] = [];

  constructor(private ordersService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.ordersService.getCurrentOrders().subscribe(objs => {
      this.orders = objs[0];
      this.menus = objs[1];
    })
    let eventObservable = Observable.fromEvent(this.input.nativeElement, 'keyup');
    eventObservable.subscribe();
  }

  finishOrder(_id: any) {
    this.ordersService.finishOrder(_id).subscribe(data => {
      this.router.navigateByUrl('/finished');
    });
  }

}


@Pipe({
  name: 'OrderPipe',
  pure: false
})
export class OrderPipe implements PipeTransform {
  transform(data: any[], searchTerm: string): any[] {
    searchTerm = searchTerm.toUpperCase();
    return data.filter(order => {
      return (order.name.toUpperCase().indexOf(searchTerm) !== -1) ||
        (order.phone.toUpperCase().indexOf(searchTerm) !== -1) ||
        (order.address.toUpperCase().indexOf(searchTerm) !== -1) ||
        (order.addInfo.toUpperCase().indexOf(searchTerm) !== -1)
    });
  }
}
