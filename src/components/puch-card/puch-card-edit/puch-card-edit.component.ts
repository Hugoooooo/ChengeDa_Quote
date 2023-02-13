import { PunchService } from './../../../services/punch.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardRecordModel } from 'src/models/form/form.model';
import { DomainProvider } from 'src/providers/domainProvider';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

@Component({
  selector: 'app-puch-card-edit',
  templateUrl: './puch-card-edit.component.html',
  styleUrls: ['./puch-card-edit.component.scss']
})
export class PuchCardEditComponent implements OnInit {
  public year;
  public yearDDL = [];
  public month;
  public monthDDL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public memberId;
  public memberDDL: any;
  public dataList: Array<CardRecordModel>;
  constructor(
    public modalService: NgbModal,
    public domainProvider: DomainProvider,
    public punchService: PunchService,
  ) { }

  ngOnInit() {
    this.pagePrepare();
    this.punchService.getMemberDDL().subscribe(p => {
      this.memberDDL = p;
    });
  }

  pagePrepare() {
    this.dataList = [];
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
  }


  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  loadForm() {
    this.dataList = [];
    let days = this.getDaysInMonth(this.year, this.month);
    for (var i = 1; i <= days; i++) {
      const addItem = new CardRecordModel();
      addItem.punchDate = `${this.year}/${this.month}/${i}`;
      addItem.onWork = '';
      addItem.offWork = '';
      addItem.isHoliday = this.checkWeekend(new Date(addItem.punchDate).getDay());
      addItem.isFillDay = false;
      this.dataList.push(addItem);
    }
  }

  checkWeekend(day) {
    return day == 0 || day == 6;
  }

  submit() {
    if (this.check()) {
      let reqbody = {
        memberId: this.memberId,
        year: this.year,
        month: this.month,
        items: this.dataList.filter(p => p.onWork && p.offWork).map(p => ({
          punchDate: p.punchDate,
          onWork: p.onWork,
          offWork: p.offWork,
          isHoliday: p.isHoliday,
          isFillDay: p.isFillDay,
        }))
      };
      this.punchService.insertPunchDetail(reqbody).subscribe(ret=>{
        Swal.fire({
          confirmButtonText: '確定',
          icon: ret.isError ? 'error' : 'success',
          title: '通知',
          html: ret.message
        })
      });
    }
  }

  check() {
    const errArray = [];
    let isPass = true;
    if (!this.memberId) {
      errArray.push('請選擇員工');
    }

    if (this.dataList.filter(p => (p.onWork || p.offWork) && !(p.onWork && p.offWork)).length > 0) {
      errArray.push('打卡資料輸入不完整');
    } else if (this.dataList.filter(p => p.onWork && (p.onWork.length != 4 || p.offWork.length != 4)).length > 0) {
      errArray.push('打卡資料格式必須為4個數字');
    }

    if (errArray.length > 0) {
      isPass = false;
      Swal.fire({
        confirmButtonText: '確定',
        icon: 'error',
        title: '通知',
        html: _.join(errArray, '<br/>'),
      });
    }
    return isPass;
  }

  reset() {

  }

}
