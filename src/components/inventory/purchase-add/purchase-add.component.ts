import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEvent, CreateFormGroupArgs, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { PageSize, PuchaseTypeDDL } from 'src/app/app.constant';
import { AddPurchaseDetail, AddPurchaseOrderModel } from 'src/models/form/form.model';
import { PurchaseOrderService } from 'src/services/purchase-order.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})


export class PurchaseAddComponent implements OnInit {
  public purchaseTypeDDL = PuchaseTypeDDL;
  public purchaseDate: any;
  public note: any;
  public formData = new AddPurchaseOrderModel();
  public formGroup: FormGroup = this.formBuilder.group({
    id: null,
    inventoryId:'',
    pattern: '',
    machineId: '',
    brand: '',
    price: '',
  });

  @Input() order: any;
  @Input() brandDDL: any[] = [];
  @Output() saveItem = new EventEmitter<any>();
  editMode: any;
  constructor(
    public service: PurchaseOrderService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public domainProvider: DomainProvider,
    public datePipe: DatePipe) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit() {
    this.editMode = this.order ? "Edit" : "Add";
    if (this.editMode == 'Add') {
      this.purchaseDate = new Date();
      this.formData.type = this.purchaseTypeDDL[0];
      this.formData.purchaseDate = this.datePipe.transform(this.purchaseDate, 'yyyy/MM/dd');
      this.formData.note = '';
    } else {
      this.formData.note = this.order.note;
      this.formData.type = this.order.type;
      this.formData.orderId = this.order.id;
      this.purchaseDate = this.order.purchaseDate;
      this.formData.purchaseDate = this.datePipe.transform(this.purchaseDate, 'yyyy/MM/dd');
      this.formData.items = this.order.detail;
    }

  }

  cancel() {
    this.activeModal.dismiss();
  }

  save() {
    if (!this.check()) {
      return;
    }
    this.domainProvider.showMask();
    this.service.addPurchaseOrder(this.formData).subscribe(ret => {
      this.domainProvider.hideMask();
      Swal.fire({
        confirmButtonText: '確定',
        icon: ret.isError ? 'error' : 'success',
        title: '通知',
        html: ret.message
      });
      if(!ret.isError){
        this.saveItem.emit(true);
        this.activeModal.dismiss();
      }
    })

  }

  update() {
    if (!this.check()) {
      return;
    }
    this.domainProvider.showMask();
    this.service.updatePurchaseOrder(this.formData).subscribe(ret => {
      this.domainProvider.hideMask();
      Swal.fire({
        confirmButtonText: '確定',
        icon: ret.isError ? 'error' : 'success',
        title: '通知',
        html: ret.message
      });
      if(!ret.isError){
        this.saveItem.emit(true);
        this.activeModal.dismiss();
      }
    })

  }

  check() {
    let isPass = true;
    const errArray = [];

    if (!this.formData.purchaseDate) {
      errArray.push('進貨日期欄位不能為空值');
    }

    if (this.formData.items.length === 0) {
      errArray.push('至少要添加一個進貨項目');
    }

    const machineIds = new Set();

    for (let i = 0; i < this.formData.items.length; i++) {
      const item = this.formData.items[i];

      if (!item.pattern || !item.machineId || !item.brand) {
        errArray.push(`第 ${i + 1} 筆進貨項目: 所有欄位都必須填寫`);
      }

      // if (this.editMode === 'Edit' && !item.price) {
      //   errArray.push(`第 ${i + 1} 筆進貨項目: 價錢 必須填寫`);
      // }

      if (machineIds.has(item.machineId)) {
        errArray.push(`第 ${i + 1} 筆進貨項目: 機號 不能重複`);
      }

      machineIds.add(item.machineId);
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

  createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const item = args.isNew ? new AddPurchaseDetail(this.brandDDL[0]) : args.dataItem;

    this.formGroup = this.formBuilder.group({
      id: item.id,
      inventoryId: item.inventoryId,
      pattern: item.pattern,
      machineId: item.machineId,
      brand: item.brand,
      price: item.price
    });

    return this.formGroup;
  }

  pruchaseDataChange(event) {
    this.purchaseDate = event;
    this.formData.purchaseDate = this.datePipe.transform(event, 'yyyy/MM/dd');
  }

  isDeleteBtnShow(status) {
    return status != '已出貨' && status != '已退貨';
  }
}
