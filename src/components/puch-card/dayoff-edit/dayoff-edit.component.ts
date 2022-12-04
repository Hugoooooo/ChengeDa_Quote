import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DayoffEditModel } from 'src/models/form/form.model';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

@Component({
  selector: 'app-dayoff-edit',
  templateUrl: './dayoff-edit.component.html',
  styleUrls: ['./dayoff-edit.component.scss']
})
export class DayoffEditComponent implements OnInit {
  @Input() dataItem: any;
  @Input() memberDDL: any;
  @Output() saveItem = new EventEmitter<any>();
  public typeDDL = [{ 'text': '特休', 'value': '特休' }, { 'text': '病假', 'value': '病假' }, { 'text': '事假', 'value': '事假' }];
  public title;
  public formData: DayoffEditModel;
  constructor(
    public datePipe: DatePipe,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.formData = new DayoffEditModel();
    console.log(this.memberDDL)
  }

  cancel() {
    this.activeModal.dismiss();
  }


  check() {
    let isPass = true;
    const errArray = [];

    if (!this.formData.memberId) {
      errArray.push('員工不能為空值');
    }

    if (!this.formData.type) {
      errArray.push('假別不能為空值');
    }

    if (!this.formData.offDate) {
      errArray.push('請假日期不能為空值');
    }

    if(!this.formData.isAllDay){
      if (!this.formData.startDate) {
        errArray.push('起始時間不能為空值');
      }else if (this.formData.startDate.length != 4){
        errArray.push('起始時間格式不正確');
      }

      if (!this.formData.endDate) {
        errArray.push('結束時間不能為空值');
      }else if (this.formData.endDate.length != 4){
        errArray.push('結束時間格式不正確');
      }
    }



    if (errArray.length > 0) {
      isPass = false;
      Swal.fire({
        icon: 'error',
        confirmButtonText: '確定',
        title: '通知',
        html: _.join(errArray, '<br/>'),
      });
    }
    return isPass;
  }

  save() {
    if (this.check()) {
      this.formData.offDate = this.datePipe.transform(this.formData.offDate, 'yyyy/MM/dd');
      if(!this.formData.isAllDay){
        this.formData.startDate = `${this.formData.offDate} ${this.formData.startDate.substr(0,2)}:${this.formData.startDate.substr(2,2)}`;
        this.formData.endDate = `${this.formData.offDate} ${this.formData.endDate.substr(0,2)}:${this.formData.endDate.substr(2,2)}`;
      }else{
        this.formData.startDate = `${this.formData.offDate} 08:00`;
        this.formData.endDate = `${this.formData.offDate} 17:00`;
      }
      this.saveItem.emit(this.formData);
      this.activeModal.close();
    }
  }
}
