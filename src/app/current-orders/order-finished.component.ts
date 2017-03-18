import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'order-finished',
  template: '<h4>Order Finished! Returning to Current Order List</h4>'
})
export class OrderFinishedComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigateByUrl("/");
  }

}
