import { Component, OnInit } from '@angular/core';
import { CompositeFilterDescriptor, State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { PageSize, SwalDeleteOption } from 'src/app/app.constant';
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
@Component({
  selector: 'app-ship-list',
  templateUrl: './ship-list.component.html',
  styleUrls: ['./ship-list.component.scss']
})

export class ShipListComponent implements OnInit {
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
    public service: ShipOrderService,
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
    this.startDate = new Date(today.setMonth(today.getMonth() - 1))
    this.endDate = new Date();

    this.formData.sDate = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    this.formData.eDate = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');

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

  remove(dataItem){
    Swal.fire(SwalDeleteOption).then((result) => {
      if (result.value) {
        this.domainProvider.showMask();
        this.service.remove({orderId: dataItem.id}).subscribe(ret=>{
        this.domainProvider.hideMask();
          Swal.fire({
            confirmButtonText: '確定',
            icon: ret.isError ? 'error' : 'success',
            title: '通知',
            html: ret.message
          });
          if(!ret.isError){
            this.service.reset();
            this.service.read();
          }
        })
      }
    });

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

}
