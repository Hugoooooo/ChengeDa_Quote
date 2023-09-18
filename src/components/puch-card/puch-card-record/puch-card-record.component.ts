import { GetPunchListFormModel, PunchRecordService } from './../../../services/punch-record.service';
import { PunchService } from './../../../services/punch.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomainProvider } from 'src/providers/domainProvider';
import { State, process, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { PageSize } from 'src/app/app.constant';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-puch-card-record',
  templateUrl: './puch-card-record.component.html',
  styleUrls: ['./puch-card-record.component.scss']
})
export class PuchCardRecordComponent implements OnInit {
  public hourSwitch = false;
  public yearDDL = [];
  public monthDDL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public memberDDL: any;
  public formData: GetPunchListFormModel = new GetPunchListFormModel();
  public filter: CompositeFilterDescriptor;
  public view: Observable<GridDataResult>;
  public _PAGESIZE = PageSize;
  public gridState: State = {
    sort: [{
      field: 'punchDate',
      dir: 'asc'
    }],
    skip: 0,
    take: 10
  };
  constructor(
    public recordService: PunchRecordService,
    public punchService: PunchService,
    public datePipe: DatePipe,
    public domainProvider: DomainProvider
  ) { }

  ngOnInit() {
    this.punchService.getMemberDDL().subscribe(p => {
      this.memberDDL = p;
      console.log(p);
      this.pagePrepare();
      this.view = this.recordService.pipe(map(data => process(data, this.gridState)));
      this.recordService.reset();
      this.recordService.read();
    });
  }

  pagePrepare() {
    this.formData = new GetPunchListFormModel();
    this.formData.year = new Date().getFullYear();
    this.formData.month = new Date().getMonth() + 1;
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
    this.formData.memberId = this.memberDDL[0].value;
  }

  onStateChange(state: State) {
    this.gridState = state;
    this.recordService.read();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
  }

  search() {
    this.recordService.hourSwitch = this.hourSwitch;
    this.gridState.skip = 0;
    this.recordService.reset();
    this.recordService.search(this.formData);
  }

  reset() {

  }

}
