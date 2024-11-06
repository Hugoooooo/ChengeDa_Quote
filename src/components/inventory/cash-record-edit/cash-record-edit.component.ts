import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEvent, CreateFormGroupArgs, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { CashMethodDDL, PageSize, ShipStatusDDL, ShipTypeDDL } from 'src/app/app.constant';
import { AddPurchaseDetail, AddPurchaseOrderModel, AddShipOrderModel, CashRecordDetail, UpdateShipOrderModel } from 'src/models/form/form.model';
import { PurchaseOrderService } from 'src/services/purchase-order.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';
import { InventoryPickComponent } from '../inventory-pick/inventory-pick.component';
import { ShipOrderService } from 'src/services/ship-order.service';
import { CashOrderService } from 'src/services/cash-order.service';

@Component({
  selector: 'app-cash-record-edit',
  templateUrl: './cash-record-edit.component.html',
  styleUrls: ['./cash-record-edit.component.scss']
})


export class CashRecordEditComponent implements OnInit {
  public _PAGESIZE = PageSize;
  public cashMethodDDL = CashMethodDDL;
  public formGroup: FormGroup = this.formBuilder.group({
    amount: 0,
    method: '',
    payDate: null
  });

  public pageData: any;

  @Input() order: any;
  @Output() saveItem = new EventEmitter<any>();
  constructor(
    public service: CashOrderService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public domainProvider: DomainProvider,
    public datePipe: DatePipe,
    public modalService: NgbModal
  ) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit() {
    this.pageData = JSON.parse(JSON.stringify(this.order));
    this.pageData.shipDate = this.datePipe.transform(this.pageData.shipDate, 'yyyy/MM/dd');
    this.pageData.cashRecords = this.pageData.cashRecords.map(record=>{
      return{
        ...record,
        payDate: new Date(record.payDate)
      }
    });
  }



  cancel() {
    this.activeModal.dismiss();
  }

  save() {
    if (!this.check()) {
      return;
    }
    this.domainProvider.showMask();
    let reqBody = {
      orderId: this.pageData.orderId,
      items: this.pageData.cashRecords.map(record => ({
        id: record.id,
        amount: record.amount,
        method: record.method,
        payDate:  this.datePipe.transform(record.payDate, 'yyyy/MM/dd')
      }))
    };

    this.service.updateCashRecord(reqBody).subscribe(ret => {
      this.domainProvider.hideMask();
      Swal.fire({
        confirmButtonText: '確定',
        icon: ret.isError ? 'error' : 'success',
        title: '通知',
        html: ret.message
      });
      if (!ret.isError) {
        this.saveItem.emit(true);
        this.activeModal.dismiss();
      }
    })

  }

  check() {
    let isPass = true;
    const errArray = [];

    const currentDate = new Date();

    // 新增的檢查邏輯
    if (this.pageData.cashRecords && this.pageData.cashRecords.length > 0) {
      // 1. 檢查 cashRecords 裡面的 amount 不能為空或是 null
      this.pageData.cashRecords.forEach((record, index) => {
        if (record.amount === null || record.amount === undefined || record.amount === '') {
          errArray.push(`收款記錄中第 ${index + 1} 筆的金額不能為空`);
        }

        const payDate = new Date(record.payDate);
        if (payDate > currentDate) {
          errArray.push(`收款記錄中第 ${index + 1} 筆的收款日期 (${this.datePipe.transform(record.payDate, 'yyyy/MM/dd')}) 不能大於當前日期`);
        }
      });

      // 2. 檢查 cashRecords 裡面的 amount 總和不能大於 amount
      const totalCashAmount = this.pageData.cashRecords.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
      if (totalCashAmount > this.pageData.amount) {
        errArray.push(`收款總金額 (${totalCashAmount}) 不能大於出貨金額 (${this.pageData.amount})`);
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

  getRemainingAmount(){
    const totalCashAmount = this.pageData.cashRecords.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
    return this.pageData.amount-totalCashAmount;
  }

  createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const item = args.isNew ? new CashRecordDetail(CashMethodDDL[0], new Date()) : args.dataItem;

    this.formGroup = this.formBuilder.group({
      id: item.id,
      amount: item.amount,
      method: item.method,
      payDate: item.payDate
    });

    return this.formGroup;
  }

  payDateChange(event, dataItem: any) {
    dataItem.payDate = this.datePipe.transform(event, 'yyyy/MM/dd');
  }

  isDeleteBtnShow(status) {
    return status != '已收款';
  }

}
