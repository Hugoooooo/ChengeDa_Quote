import { Component, OnInit } from '@angular/core';
import { CompositeFilterDescriptor, State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { InventoryStatusDDL, PageSize, SwalDeleteOption } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { DomainProvider } from 'src/providers/domainProvider';
import { PunchService } from 'src/services/punch.service';
import { map, filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';
import { AuthService } from 'src/services/auth.service';
import { ShipAddComponent } from '../ship-add/ship-add.component';
import { GetListFormData, InventoryService } from 'src/services/inventory.service';
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})

export class InventoryListComponent implements OnInit {
  public statusDDL = InventoryStatusDDL;
  public formData: GetListFormData;
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
    public service: InventoryService,
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


  pagePrepare() {
    this.formData = new GetListFormData();
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
    const modalRef = this.modalService.open(ShipAddComponent, {
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

  openPurchaseModal(dataItem) {
    const purchaseOrder$ = this.service.getPurchaseOrder(dataItem.purchaseOrderId);
    const systemParam$ = this.authService.initSystemParam();

    this.domainProvider.showMask();

    combineLatest([purchaseOrder$, systemParam$]).subscribe(([purchaseDetail, sysParams]) => {
      this.domainProvider.hideMask();

      const modalRef = this.modalService.open(PurchaseAddComponent, {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.brandDDL = sysParams ? sysParams.items.find(p => p.type === 'Brand').values : [];
      modalRef.componentInstance.order = purchaseDetail;
      modalRef.componentInstance.saveItem.subscribe((data) => {
        if (data) {
          this.service.reset();
          this.service.read();
        }
      });
    });
  }

  openShipModal(dataItem) {
    this.domainProvider.showMask();
    this.service.getShipOrder(dataItem.shipOrderId).subscribe(ret => {
      this.domainProvider.hideMask();
      const modalRef = this.modalService.open(ShipAddComponent, {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.order = ret;
      modalRef.componentInstance.saveItem.subscribe((data) => {
        if (data) {
          this.service.reset();
          this.service.read();
        }
      });
    });
  }

}
