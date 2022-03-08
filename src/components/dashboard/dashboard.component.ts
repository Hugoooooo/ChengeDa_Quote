import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public listItems: Array<string> = [
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "2X-Large",
  ];
  public tagPorpList = [
    {
      text: '會員',
      value: 'M'
    },
    {
      text: '訂單',
      value: 'O'
    }
  ];
  value = '';

  constructor() { }

  ngOnInit() {
    console.log(this.tagPorpList);
  }
  // 標籤屬性改變時： propValue -> M 會員; O 訂單
  onPropChange(propValue: string): void {

  }

}
