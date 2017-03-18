import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class CustomersService {

  // customers: any[] = [];

  constructor(private http: Http) { }

  getCustomers() {
    return this.http.get('/customers')
      .map(res => {
        const data = res.json().obj;
        let objs: any[] = [];
        for (let i = 0; i < data.length; i++) {
          objs.push(data[i]);
        };
        return objs;
      })
  }

  addCustomer(customer: any) {
    const body = JSON.stringify(customer.value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/customers/new', body, {headers: headers})
      .map(res => {
        const data = res.json().obj;
      })
  }

  getCustomer(_id: any) {
    return this.http.get('/customers/' + _id)
      .map(res => {
        const data = res.json().obj;
        return data;
      })
  }

  getCustomerOrders(_id: any) {
    return this.http.get('/customers/' + _id + '/orders')
      .map(res => {
        const data = res.json().obj;
        let objs: any[] = [];
        for (let i = 0; i < data.length; i++) {
          objs.push(data[i]);
        };
        return objs;
      })
  }

  updateCustomer(_id: any, customer: any) {
    customer._id = _id;
    const body = JSON.stringify(customer);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('/customers/edit', body, {headers: headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

}
