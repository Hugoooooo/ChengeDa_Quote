import { DayoffEditComponent } from './../dayoff-edit/dayoff-edit.component';
import { DayoffService, GetDayoffListFormModel } from './../../../services/dayoff.service';
import { Component, OnInit } from '@angular/core';
import { CompositeFilterDescriptor, State,process } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { PageSize } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { DomainProvider } from 'src/providers/domainProvider';
import { PunchService } from 'src/services/punch.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dayoff-list',
  templateUrl: './dayoff-list.component.html',
  styleUrls: ['./dayoff-list.component.scss']
})
export class DayoffListComponent implements OnInit {
  public yearDDL = [];
  public monthDDL = [-1,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public memberDDL: any;
  public formData: GetDayoffListFormModel;
  public filter: CompositeFilterDescriptor;
  public view: Observable<GridDataResult>;
  public _PAGESIZE = PageSize;
  public gridState: State = {
    sort: [{
      field: 'createTime',
      dir: 'desc'
    }],
    skip: 0,
    take: 10
  };
  constructor(
    public dayoffService: DayoffService,
    public punchService: PunchService,
    public datePipe: DatePipe,
    public domainProvider: DomainProvider,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.pagePrepare();
    this.punchService.getMemberDDL().subscribe(p => {
      this.memberDDL = p;
    });
    this.view = this.dayoffService.pipe(map(data => process(data, this.gridState)));
    this.dayoffService.reset();
    // this.dayoffService.read();
  }

  pagePrepare() {
    this.formData = new GetDayoffListFormModel();
    this.formData.year = new Date().getFullYear();
    this.formData.month = new Date().getMonth()+1;
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
  }


  onStateChange(state: State) {
    this.gridState = state;
    this.dayoffService.read();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
  }

  search(){
    this.gridState.skip = 0;
    this.dayoffService.reset();
    this.dayoffService.search(this.formData);
  }

  reset(){
  }

  openAddModal(si, dataItem) {
    const modalRef = this.modalService.open(DayoffEditComponent, {
      size: si,
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.memberDDL = this.memberDDL;

    modalRef.componentInstance.saveItem.subscribe((data) => {
      this.domainProvider.showMask();
      console.log(data);
      this.dayoffService.insertDayoffDetail(data).subscribe(ret => {
        Swal.fire({
          confirmButtonText: '確定',
          icon: !ret.isError ? 'success' : 'error',
          title: '通知',
          html: ret.message
        });
        this.domainProvider.hideMask();
      });
    })
  }
}
