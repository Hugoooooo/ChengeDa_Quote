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
  dataList: Array<CardRecordModel>;
  constructor() { }

  ngOnInit() {
    let now = new Date();
    // this.year = now.get
    this.dataList = [];
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
    this.year = now.getFullYear();
    this.month = now.getMonth() + 1;

    console.log(this.calcTwoTime('0800', '1700'));
  }


  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  loadForm() {
    this.dataList = [];
    let days = this.getDaysInMonth(this.year, this.month);
    for (var i = 1; i <= days; i++) {
      const addItem = new CardRecordModel();
      addItem.year = this.year;
      addItem.month = this.month;
      addItem.day = i;
      addItem.startTime = '';
      addItem.endTime = '';
      addItem.dayOff = this.checkWeekend(new Date(this.year, this.month - 1, i));
      // console.log(addItem);
      this.dataList.push(addItem);
    }
  }

  checkWeekend(target) {
    let day = target.getDay();
    return day == 0 || day == 6;
  }

  preview() {
    console.log(this.dataList);
  }

  calcTwoTime(startTime, endTime) {
    let start = new Date(`2022/01/01 ${startTime.substr(0, 2)}:${startTime.substr(2, 4)}`);
    let end = new Date(`2022/01/01 ${endTime.substr(0, 2)}:${endTime.substr(2, 4)}`);
    let secs = end.getTime() - start.getTime();
    let hours = secs / 1000 / 60 / 60;
    return Math.floor(hours);
  }

}
