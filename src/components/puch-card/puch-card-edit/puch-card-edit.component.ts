import { Component, OnInit } from '@angular/core';
import { CardRecordModel } from 'src/models/form/form.model';

@Component({
  selector: 'app-puch-card-edit',
  templateUrl: './puch-card-edit.component.html',
  styleUrls: ['./puch-card-edit.component.scss']
})
export class PuchCardEditComponent implements OnInit {
  year;
  yearDDL = [];
  month;
  monthDDL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  dataList:Array<CardRecordModel>;
  constructor() { }

  ngOnInit() {
    this.dataList = [];
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
  }


  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  loadForm(){
    this.dataList = [];
    let days = this.getDaysInMonth(this.year,this.month);
    for (var i = 1; i <= days; i++) {
      const addItem = new CardRecordModel();
      addItem.year = this.year;
      addItem.month = this.month;
      addItem.day = i;
      addItem.startTime = '';
      addItem.endTime = '';
      addItem.dayOff = this.checkWeekend(i);
      console.log(addItem);
      this.dataList.push(addItem);
    }
  }

  checkWeekend(day){
    return day%6 ==0 || day%7 ==0;
  }

}
