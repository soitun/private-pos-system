import {Component, OnInit} from "@angular/core";
import {OrdersService} from "../orders.service";
import {FormBuilder, FormGroup} from "@angular/forms";
/**
 * Created by Lewis on 2017-03-14.
 */

@Component({
  selector: 'charts',
  template : `
  <!--Date Search Input-->
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <div class="margin-20">
          <h4>Select Time Period</h4>
        </div>
        <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
          <div class="form-group">
            <label>From</label>
            <input type="date" class="form-control" formControlName="startDate">
          </div>
          <div class="form-group">
            <label>To</label>
            <input type="date" class="form-control" formControlName="endDate">
            <small>End Date must be at least 1 day later than Start Date</small>
          </div>
  
          <div class="margin-20">
            <button type="submit" class="btn btn-primary pull-right">Draw Chart!</button>
          </div>
          <div class="clearfix"></div>
          
          <!--&lt;!&ndash;Show Form Data as JSON&ndash;&gt;-->
          <!--<div class="margin-20">-->
            <!--<div>myForm details:-</div>-->
            <!--<pre>form value: <br>{{myForm.value | json}}</pre>-->
          <!--</div>-->
          
        </form>
      </div>
    </div>
  </div>
  <!--Bar Chart for Daily/Monthly sales-->
  <div class="col-xs-12 col-md-10 offset-md-1">
    <div style="display: block">
      <canvas baseChart
              [datasets]="barChartData"
              [labels]="barChartLabels"
              [options]="barChartOptions"
              [legend]="barChartLegend"
              [chartType]="barChartType"
              (chartHover)="chartHovered($event)"
              (chartClick)="chartClicked($event)"></canvas>
    </div>
    <div *ngIf="!isMonthly">
      <button (click)="switchBarGraph()">Switch To Monthly</button>
    </div>
    <div *ngIf="isMonthly">
      <button (click)="switchBarGraph()">Switch To Daily</button>
    </div>
  </div>
  <!--Pie Chart for Pizza vs BBT-->
  <div class="col-xs-12 col-md-10 offset-md-1" style="display: block">
    <canvas baseChart
            [data]="pieChartData"
            [labels]="pieChartLabels"
            [chartType]="pieChartType"
            (chartHover)="chartHovered($event)"
            (chartClick)="chartClicked($event)"></canvas>
  </div>
  <!--Doughnut Chart for Pizza Types-->
  <div class="col-xs-12 col-md-10 offset-md-1" style="display: block">
  <canvas baseChart
              [data]="doughnutChartData"
              [labels]="doughnutChartLabels"
              [chartType]="doughnutChartType"
              (chartHover)="chartHovered($event)"
              (chartClick)="chartClicked($event)"></canvas>
  </div>
  `
})

export class ChartsComponent implements OnInit{

  myForm: FormGroup;
  monthly: any[];
  daily: any[];
  pieData: any;
  doughnutData: any;
  isMonthly: Boolean = false;
  start: Date;
  end: Date;

  // Bar Chart Input
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = [];
  // public barChartLabels: string[] = [];

  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [], label: 'Pizza'},
    {data: [], label: 'Side'}
  ];

  // Pie Chart Input
  public pieChartLabels:string[] = ['Pizza', 'Side'];
  public pieChartData:number[] = [0, 0];
  public pieChartType:string = 'pie';

  // Doughnut Chart Input
  public doughnutChartLabels:string[] = ["Peperoni", "Cheese", "Supreme", "Vegetarian", "Hawaiian", "Greek",
    "Mexican", "Meat Lover", "Chicken", "Canadian", "Sweet Potato", "Custom"];
  public doughnutChartData:number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  public doughnutChartType:string = 'doughnut';

  constructor(private ordersService: OrdersService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      startDate: [Date],
      endDate: [Date]
    });

    var startDate = new Date();
    startDate.setDate(startDate.getDate()-14);
    var endDate = new Date();
    var fromMonth = (+startDate.getMonth()+1 > 9) ? +startDate.getMonth()+1 : "0"+(+startDate.getMonth()+1);
    var toMonth = (+endDate.getMonth()+1 > 9) ? +endDate.getMonth()+1 : "0"+(+endDate.getMonth()+1);
    var fromDate = (+startDate.getDate()+1 > 9) ? startDate.getDate() : "0"+startDate.getDate();
    var toDate = (+endDate.getDate()+1 > 9) ? endDate.getDate() : "0"+endDate.getDate();
    var from = startDate.getFullYear() + "-" + fromMonth + "-" + fromDate;
    var to = endDate.getFullYear() + "-" + toMonth + "-" + toDate;
    this.start = startDate;
    this.end = endDate;
    this.myForm.setValue({
      startDate: from,
      endDate: to
    });

    this.ordersService.getChartInput(this.myForm).subscribe(data => {
      this.monthly = data[0];
      this.daily = data[1];
      this.pieData = data[2];
      this.doughnutData = data[3];

      // Change Bar Graph
      this.barChartLabels.length = 0;

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = [];
      clone[1].data = [];
      let toDate = this.end;
      toDate.setDate(toDate.getDate()-this.daily.length);

      for (let i=this.daily.length-1; i>=0; i--) {
        toDate.setDate(toDate.getDate()+1);
        this.barChartLabels.push(String(toDate.getDate()));
        clone[0].data.push(+this.daily[i].pizzaCount);
        clone[1].data.push(+this.daily[i].sideCount);
      }
      this.barChartData = clone;

      // Change Pie Chart
      this.pieChartData = [this.pieData.pizzaCount, this.pieData.sideCount];

      // Change Doughnut Chart
      let doughnutChartDataClone = [];
      doughnutChartDataClone.push(this.doughnutData.Peperoni);
      doughnutChartDataClone.push(this.doughnutData.Cheese);
      doughnutChartDataClone.push(this.doughnutData.Supreme);
      doughnutChartDataClone.push(this.doughnutData.Vegetarian);
      doughnutChartDataClone.push(this.doughnutData.Hawaiian);
      doughnutChartDataClone.push(this.doughnutData.Greek);
      doughnutChartDataClone.push(this.doughnutData.Mexican);
      let meatLover = data[3]['Meat Lover'];
      doughnutChartDataClone.push(meatLover);
      doughnutChartDataClone.push(this.doughnutData.Chicken);
      doughnutChartDataClone.push(this.doughnutData.Canadian);
      let sweetPotato = data[3]['Sweet Potato'];
      doughnutChartDataClone.push(sweetPotato);
      doughnutChartDataClone.push(this.doughnutData.Custom);

      this.doughnutChartData = doughnutChartDataClone;
    });
  };

  onSubmit(form: any) {
    this.isMonthly = false;

    this.ordersService.getChartInput(form).subscribe(data => {
      this.monthly = data[0];
      this.daily = data[1];
      this.pieData = data[2];
      this.doughnutData = data[3];

      // Create Date Objects
      var endYear = form.value.endDate.substring(0, 4);
      var endMonth = parseInt(form.value.endDate.substring(5, 7))-1;
      var endDate = form.value.endDate.substring(8, 10);
      this.end.setFullYear(endYear);
      this.end.setMonth(endMonth);
      this.end.setDate(endDate);

      // Change Bar Graph
      this.barChartLabels.length = 0;

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = [];
      clone[1].data = [];

      let toDate = this.end;
      toDate.setDate(toDate.getDate()-this.daily.length);
      for (let i=this.daily.length-1; i>=0; i--) {
        toDate.setDate(toDate.getDate()+1);
        this.barChartLabels.push(String(toDate.getDate()));
        clone[0].data.push(+this.daily[i].pizzaCount);
        clone[1].data.push(+this.daily[i].sideCount);
      }
      this.barChartData = clone;

      // Change Pie Chart
      this.pieChartData = [this.pieData.pizzaCount, this.pieData.sideCount];

      // Change Doughnut Chart
      let doughnutChartDataClone = [];
      doughnutChartDataClone.push(this.doughnutData.Peperoni);
      doughnutChartDataClone.push(this.doughnutData.Cheese);
      doughnutChartDataClone.push(this.doughnutData.Supreme);
      doughnutChartDataClone.push(this.doughnutData.Vegetarian);
      doughnutChartDataClone.push(this.doughnutData.Hawaiian);
      doughnutChartDataClone.push(this.doughnutData.Greek);
      doughnutChartDataClone.push(this.doughnutData.Mexican);
      let meatLover = data[3]['Meat Lover'];
      doughnutChartDataClone.push(meatLover);
      doughnutChartDataClone.push(this.doughnutData.Chicken);
      doughnutChartDataClone.push(this.doughnutData.Canadian);
      let sweetPotato = data[3]['Sweet Potato'];
      doughnutChartDataClone.push(sweetPotato);
      doughnutChartDataClone.push(this.doughnutData.Custom);

      this.doughnutChartData = doughnutChartDataClone;

    });
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }

  public switchBarGraph(): void{
    this.isMonthly = !this.isMonthly;

    if (this.isMonthly) {
      // If current mode is daily, switch to monthly
      this.barChartLabels.length = 0;

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = [];
      clone[1].data = [];
      let toDate = this.end;
      toDate.setMonth(toDate.getMonth()-this.monthly.length);


      for (let i=this.monthly.length-1; i>=0; i--) {
        var m = toDate.getMonth();
        toDate.setMonth(toDate.getMonth()+1)
        if (toDate.getMonth() - m == 2) {
          toDate.setDate(0);
        }
        this.barChartLabels.push(String(toDate.getFullYear() + "/" + (+toDate.getMonth()+1)));
        clone[0].data.push(+this.monthly[i].pizzaCount);
        clone[1].data.push(+this.monthly[i].sideCount);
      }
      this.barChartData = clone;

    } else {
      // If current mode is monthly, switch to daily
      this.barChartLabels.length = 0;

      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = [];
      clone[1].data = [];
      let toDate = this.end;
      toDate.setDate(toDate.getDate()-this.daily.length);

      for (let i=this.daily.length-1; i>=0; i--) {
        toDate.setDate(toDate.getDate()+1);
        this.barChartLabels.push(String(toDate.getDate()));
        clone[0].data.push(+this.daily[i].pizzaCount);
        clone[1].data.push(+this.daily[i].sideCount);
      }
      this.barChartData = clone;
    }

  }
}
