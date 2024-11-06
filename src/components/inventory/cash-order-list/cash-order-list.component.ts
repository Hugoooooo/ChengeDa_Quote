import { CashRecordEditComponent } from 'src/components/inventory/cash-record-edit/cash-record-edit.component';
import { Component, OnInit } from '@angular/core';
import { CompositeFilterDescriptor, State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { PageSize, ShipStatusDDL, SwalDeleteOption } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { DomainProvider } from 'src/providers/domainProvider';
import { PunchService } from 'src/services/punch.service';
import { map, filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';
import { AuthService } from 'src/services/auth.service';
import { ShipAddComponent } from '../ship-add/ship-add.component';
import { GetListFormData,ShipOrderService } from 'src/services/ship-order.service';
import { CashOrderService } from 'src/services/cash-order.service';
@Component({
  selector: 'app-cash-order-list',
  templateUrl: './cash-order-list.component.html',
  styleUrls: ['./cash-order-list.component.scss']
})

export class CashOrderListComponent implements OnInit {
  public formData: GetListFormData;
  public shipStatusDDL = ['全部'].concat(ShipStatusDDL);
  public startDate: any;
  public endDate: any;
  public filter: CompositeFilterDescriptor;
  public view: Observable<GridDataResult>;
  public _PAGESIZE = PageSize;
  public gridState: State = {
    sort: [{
      field: 'dayoffDate',
      dir: 'asc'
    }],
    skip: 0,
    take: 10
  };
  constructor(
    public service: CashOrderService,
    public authService: AuthService,
    public datePipe: DatePipe,
    public domainProvider: DomainProvider,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.pagePrepare();
    this.view = this.service.pipe(map(data => process(data, this.gridState)));
    this.service.reset();
    this.service.search(this.formData);
  }

  startTimeChange(event) {
    this.startDate = event;
    this.formData.sDate = this.datePipe.transform(event, 'yyyy/MM/dd');
  }

  endTimeChange(event) {
    this.endDate = event;
    this.formData.eDate = this.datePipe.transform(event, 'yyyy/MM/dd');
  }

  pagePrepare() {
    this.formData = new GetListFormData();
    let today = new Date();
    this.startDate = new Date(today.setMonth(today.getMonth() - 3))
    this.endDate = new Date();

    this.formData.sDate = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    this.formData.eDate = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');
    this.formData.status = this.shipStatusDDL[1];
  }


  onStateChange(state: State) {
    this.gridState = state;
    this.service.read();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
  }

  search() {
    this.gridState.skip = 0;
    this.service.reset();
    this.service.search(this.formData);
  }

  reset() {
    this.pagePrepare();
  }


  openModal(dataItem) {
    const modalRef = this.modalService.open(CashRecordEditComponent, {
      size: 'xxl',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.order = dataItem;
    modalRef.componentInstance.saveItem.subscribe((data) => {
      if (data) {
        this.service.reset();
        this.service.read();
      }
    });

  }

}
