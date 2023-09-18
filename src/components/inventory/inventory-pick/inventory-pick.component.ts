import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEvent, CreateFormGroupArgs, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { PageSize } from 'src/app/app.constant';
import { AddPurchaseDetail, AddPurchaseOrderModel, InventroyPickModel } from 'src/models/form/form.model';
import { PurchaseOrderService } from 'src/services/purchase-order.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

@Component({
  selector: 'app-inventory-pick',
  templateUrl: './inventory-pick.component.html',
  styleUrls: ['./inventory-pick.component.scss']
})


export class InventoryPickComponent implements OnInit {
  public mySelection: any[] = [];
  public filter: CompositeFilterDescriptor;
  public purchaseDate: any;
  public note: any;
  public formGroup: FormGroup = this.formBuilder.group({
    inventoryId: '',
    machineId: '',
    type: '',
    brand: '',
    price: 0,
  });

  @Input() inventorys: any;
  @Input() details: any;
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
    this.mySelection = this.details.map(p => p.inventoryId);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  save() {
    let ret = this.inventorys.filter(p => this.mySelection.includes(p.id));
    this.saveItem.emit(ret);
    this.activeModal.close();
  }


  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
  }

  createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const item = args.isNew ? new InventroyPickModel() : args.dataItem;

    this.formGroup = this.formBuilder.group({
      inventoryId: item.inventoryId,
      machineId: item.machineId,
      isPick: item.isPick,
      type: item.type,
      brand: item.brand,
    });

    return this.formGroup;
  }

}
