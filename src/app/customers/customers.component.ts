import {Component, OnInit, Input, Pipe, PipeTransform, ElementRef, ViewChild} from '@angular/core';
import {CustomersService} from "../customers.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @ViewChild('input')
  input: ElementRef;
  customers: any[] = [];

  constructor(private customersService: CustomersService) { }

  ngOnInit() {
    this.customersService.getCustomers().subscribe(customers => {
      this.customers = customers;
    })
    let eventObservable = Observable.fromEvent(this.input.nativeElement, 'keyup');
    eventObservable.subscribe();
  }

}

@Pipe({
  name: 'NamePipe',
  pure: false
})
export class NamePipe implements PipeTransform {
  transform(data: any[], searchTerm: string): any[] {
    searchTerm = searchTerm.toUpperCase();
    return data.filter(customer => {
      return (customer.name.toUpperCase().indexOf(searchTerm) !== -1) ||
        (customer.phone.toUpperCase().indexOf(searchTerm) !== -1) ||
        (customer.description.toUpperCase().indexOf(searchTerm) !== -1) ||
        (customer.address.toUpperCase().indexOf(searchTerm) !== -1)
    });
  }
}
