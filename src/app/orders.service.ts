import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class OrdersService {

  constructor(private http: Http) { }

  getOrders() {
    return this.http.get('/orders')
      .map(res => {
        const data = res.json().obj;
        let objs: any[] = [];
        for (let i = 0; i < data.length; i++) {
          objs.push(data[i]);
        };
        return objs;
      })
  }

  getCurrentOrders() {
    return this.http.get('/current')
      .map(res => {
        const data = res.json().obj;
        let objs: any[] = [];
        for (let i = 0; i < data.length; i++) {
          objs.push(data[i]);
        };
        return objs;
      })
  }

  getOrder(_id: any) {
    return this.http.get('/orders/' + _id)
      .map(res => {
        const data = res.json().obj;
        return data;
      })
  }

  addOrder(order: any) {
    const body = JSON.stringify(order.value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/orders/new', body, {headers: headers})
      .map(res => {
        const data = res.json().obj;
      })
  }

  finishOrder(_id: any) {
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('/current/' + _id, {headers: headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  updateOrder(_id: any, order: any) {
    order._id = _id;
    const body = JSON.stringify(order);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.patch('/orders/edit', body, {headers: headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error.json()));
  }

  SearchOrders(order: any) {
    const body = JSON.stringify(order.value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/orders/search', body, {headers: headers})
      .map(res => {
        const data = res.json().obj;
        return data;
      })
  }

  getChartInput(form: any) {
    const body = JSON.stringify(form.value);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/charts', body, {headers: headers})
      .map(res => {
        const data = res.json().obj;
        return data;
      })
    // }
  }

}
