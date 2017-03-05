import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {CustomersComponent, NamePipe} from './customers/customers.component';
import {RouterModule} from "@angular/router";
import {CustomersService} from "./customers.service";
import { CurrentOrdersComponent } from './current-orders/current-orders.component';
import { OrdersComponent } from './orders/orders.component';
import {OrdersService} from "./orders.service";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {CustomerFormComponent} from "./customers/customer-form.component";
import {CustomerInfoComponent} from "./customers/customer-info.component";
import {CustomerSearchComponent} from "./customers/customer-search.component";
import {CustomerEditComponent} from "./customers/customer-edit.component";
import {OrderFormComponent} from "./current-orders/order-form.component";
import {OrderMenuComponent} from "./current-orders/order-menu.component";

const ROUTES = [
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'current',
    component: CurrentOrdersComponent
  },
  {
    path: 'customers',
    component: CustomersComponent
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent
  },
  {
    path: 'customers/new',
    component: CustomerFormComponent
  },
  {
    path: 'customers/:id',
    component: CustomerInfoComponent
  },
  {
    path: 'customers/edit/:id',
    component: CustomerEditComponent
  },
  {
    path: '',
    redirectTo: '/current',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    CurrentOrdersComponent,
    OrdersComponent,
    OrderDetailComponent,
    CustomerFormComponent,
    CustomerInfoComponent,
    CustomerSearchComponent,
    NamePipe,
    CustomerEditComponent,
    OrderFormComponent,
    OrderMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule
  ],
  providers: [CustomersService, OrdersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
