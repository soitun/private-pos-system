import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';

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

  // getOrder(_id: any) {
  //   return this.http.get('/current')
  //     .map(res => {
  //       const data = res.json().obj;
  //       let objs: any[] = [];
  //       for (let i = 0; i < data.length; i++) {
  //         objs.push(data[i]);
  //       };
  //       return objs;
  //     })
  // }

  getOrder(_id: any) {
    return this.http.get('/orders/' + _id)
      .map(res => {
        const data = res.json().obj;
        // console.log("data in Service: " + data);
        return data;
      })
  }

  // assignCustomer(order: any) {
  //   const body = JSON.stringify(order);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  //   return this.http.patch('/orders/assign', body, {headers: headers})
  //     .map(response => response.json());
  // }
  //
  // updatePost(post: Post) {
  //   const body = JSON.stringify(post);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  //   return this._http.patch('http://localhost:3000/articles/' + post.postId, body, {headers: headers})
  //     .map(response => response.json())
  //     .catch(error => Observable.throw(error.json()));
  // }

}
