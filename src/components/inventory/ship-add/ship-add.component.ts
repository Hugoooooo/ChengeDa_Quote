import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEvent, CreateFormGroupArgs, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { PageSize, ShipTypeDDL } from 'src/app/app.constant';
import { AddPurchaseDetail, AddPurchaseOrderModel, AddShipOrderModel } from 'src/models/form/form.model';
import { PurchaseOrderService } from 'src/services/purchase-order.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';
import { InventoryPickComponent } from '../inventory-pick/inventory-pick.component';
import { ShipOrderService } from 'src/services/ship-order.service';

@Component({
  selector: 'app-ship-add',
  templateUrl: './ship-add.component.html',
  styleUrls: ['./ship-add.component.scss']
})


export class ShipAddComponent implements OnInit {
  public _PAGESIZE = PageSize;
  public shipTypeDDL = ShipTypeDDL;
  public shipDate: any;
  public inventorys: any[];
  public note: any;
  public formData = new AddShipOrderModel();
  public formGroup: FormGroup = this.formBuilder.group({
    id: null,
    inventoryId: '',
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
    public service: ShipOrderService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public domainProvider: DomainProvider,
    public datePipe: DatePipe,
    public modalService: NgbModal
  ) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit() {
    this.editMode = this.order ? "Edit" : "Add";
    this.service.getInventoryStock(this.order ? this.order.id : '').subscribe(ret => {
      if (ret.isError) {
        Swal.fire({
          confirmButtonText: '確定',
          icon: ret.isError ? 'error' : 'success',
          title: '通知',
          html: ret.message
        });
      } else {
        this.inventorys = ret.items;

        if (this.editMode == 'Add') {
          this.shipDate = new Date();
          this.formData.type = this.shipTypeDDL[0];
          this.formData.shipDate = this.datePipe.transform(this.shipDate, 'yyyy/MM/dd');
          this.formData.note = '';
          this.formData.taxType = '內含';
        } else {
          this.formData.orderId = this.order.id;
          this.formData.type = this.order.type;
          this.formData.customer = this.order.customer;
          this.formData.amount = this.order.amount;
          this.formData.taxType = this.order.tax_type;
          this.formData.invoice = this.order.invoice;
          this.formData.note = this.order.note;
          this.shipDate = this.order.shipDate;
          this.formData.shipDate = this.datePipe.transform(this.shipDate, 'yyyy/MM/dd');
          this.formData.items = this.order.detail;
        }
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
    this.formData.inventoryIds = this.formData.items.map(p => p.id);
    this.domainProvider.showMask();
    this.service.addPurchaseOrder(this.formData).subscribe(ret => {
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

  update() {
    if (!this.check()) {
      return;
    }
    this.formData.inventoryIds = this.formData.items.map(p => p.id);
    this.domainProvider.showMask();
    this.service.updatePurchaseOrder(this.formData).subscribe(ret => {
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

    if (!this.formData.shipDate) {
      errArray.push('出貨日期欄位不能為空值');
    }

    if (!this.formData.customer) {
      errArray.push('客戶欄位不能為空值');
    }

    if (!this.formData.taxType) {
      errArray.push('稅率計算欄位不能為空值');
    }

    if (this.formData.items.length === 0) {
      errArray.push('至少要添加一個進貨項目');
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
    this.shipDate = event;
    this.formData.shipDate = this.datePipe.transform(event, 'yyyy/MM/dd');
  }

  openModal() {
    if (!this.inventorys) {
      Swal.fire({
        icon: 'error',
        confirmButtonText: '確定',
        title: '通知',
        html: '查無庫存資料'
      });
      return;
    }
    const modalRef = this.modalService.open(InventoryPickComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.inventorys = this.inventorys;
    modalRef.componentInstance.details = this.formData.items;
    modalRef.componentInstance.saveItem.subscribe((data) => {
      if (data) {
        this.formData.items = data;
        this.service.reset();
        this.service.read();
      }
    });

  }
}
