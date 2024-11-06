import { CashRecordEditComponent } from 'src/components/inventory/cash-record-edit/cash-record-edit.component';
import { Component, OnInit } from '@angular/core';
import { CompositeFilterDescriptor, State, process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { CashMethodDDL, PageSize, ShipStatusDDL, SwalDeleteOption } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { DomainProvider } from 'src/providers/domainProvider';
import { PunchService } from 'src/services/punch.service';
import { map, filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from 'src/services/auth.service';
import { CashRecordService, GetListFormData } from 'src/services/cash-record.service';
@Component({
  selector: 'app-cash-record-list',
  templateUrl: './cash-record-list.component.html',
  styleUrls: ['./cash-record-list.component.scss']
})

export class CashRecordListComponent implements OnInit {
  public formData: GetListFormData;
  public totalAmount: number;
  public cashMethodDDL = ['全部'].concat(CashMethodDDL);
  public startDate: any;
  public endDate: any;
  public filter: CompositeFilterDescriptor;
  public view: Observable<GridDataResult>;
  public gridView: GridDataResult;
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
    public service: CashRecordService,
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

    this.view.subscribe(gridData => {
      this.gridView = gridData;
      this.calculateTotal();
    });
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
    this.formData.method = this.cashMethodDDL[0];
  }


  onStateChange(state: State) {
    this.gridState = state;
    this.service.read();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.calculateTotal();
  }

  calculateTotal() {
    if (this.gridView && this.gridView.data) {
      this.totalAmount = this.gridView.data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    } else {
      this.totalAmount = 0;
    }
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
    this.domainProvider.showMask();
    this.service.getDetail(dataItem.orderId).subscribe(ret => {
      this.domainProvider.hideMask();
      if (ret.isError) {
        Swal.fire({
          confirmButtonText: '確定',
          icon: ret.isError ? 'error' : 'success',
          title: '通知',
          html: ret.message
        });
      }
      else {
        const modalRef = this.modalService.open(CashRecordEditComponent, {
          size: 'xxl',
          backdrop: 'static',
          keyboard: false
        });
        modalRef.componentInstance.order = ret.item;
        modalRef.componentInstance.saveItem.subscribe((data) => {
          if (data) {
            this.service.reset();
            this.service.read();
          }
        });
      }
    })
  }



}
