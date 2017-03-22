import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {CustomersComponent, NamePipe} from './customers/customers.component';
import {RouterModule} from "@angular/router";
import {CustomersService} from "./customers.service";
import {CurrentOrdersComponent, OrderPipe} from './current-orders/current-orders.component';
import {OrdersComponent} from './orders/orders.component';
import {OrdersService} from "./orders.service";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {CustomerFormComponent} from "./customers/customer-form.component";
import {CustomerInfoComponent} from "./customers/customer-info.component";
import {CustomerSearchComponent} from "./customers/customer-search.component";
import {CustomerEditComponent} from "./customers/customer-edit.component";
import {OrderFormComponent} from "./current-orders/order-form.component";
import {OrderMenuComponent} from "./current-orders/order-menu.component";
import {PhoneMask} from "./current-orders/phone-mask";
import {ModalModule} from "ng2-modal";
import {OrderFinishedComponent} from "./current-orders/order-finished.component";
import {OrderEditComponent} from "./order-detail/order-edit.component";
import {PaginationService, PaginatePipe, PaginationControlsCmp} from "ng2-paginate";
import {ChartsModule} from "ng2-charts";
import {ChartsComponent} from "./charts/charts.component";
import {SelectModule} from "angular2-select";

const ROUTES = [
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: '',
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
    path: 'orders/edit/:id',
    component: OrderEditComponent
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
    path: 'finished',
    component: OrderFinishedComponent
  },
  {
    path: 'charts',
    component: ChartsComponent
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
    OrderMenuComponent,
    PhoneMask,
    OrderFinishedComponent,
    OrderEditComponent,
    OrderPipe,
    PaginatePipe,
    PaginationControlsCmp,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    ModalModule,
    ChartsModule,
    SelectModule
  ],
  providers: [CustomersService, OrdersService, PaginationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
