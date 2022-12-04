import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, zip, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
const QueryAPI = environment.apiUrl + '/PunchService/GetPunchList';

export class GetPunchListFormModel {
  memberId: number;
  year: number;
  month: number;
}

@Injectable({
  providedIn: 'root'
})
export class PunchRecordService extends BehaviorSubject<any[]> {
  public isLoading = false;
  public data: any[] = [];
  public originalData: any[] = [];
  public updatedItems: any[] = [];
  public hourSwitch = false;
  public fomrdata: GetPunchListFormModel;

  constructor(private http: HttpClient, public domainProvider: DomainProvider) {
    super([]);
  }

  search(formData) {
    this.fomrdata = formData;
    this.fetch()
      .subscribe(data => {
        this.isLoading = false;
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
      });
  }

  read() {
    if (this.data.length) {
      return super.next(this.data);
    }
    this.fetch()
      .subscribe(data => {
        this.isLoading = false;
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
      });
  }

  reset() {
    this.data = [];
    this.updatedItems = [];
  }

  fetch(): Observable<any[]> {
    this.isLoading = true;
    const api = `${QueryAPI}?memberId=${this.fomrdata.memberId || 0}&year=${this.fomrdata.year || ''}&month=${this.fomrdata.month || ''}` ;
    return this.http.get<any>(api)
      .pipe(map(res => {
        res.items.forEach(data => {
          data.punchDate = new Date(data.punchDate);
          if(this.hourSwitch){
            data.regularTotal = `${Math.round((data.regularTotal / 60) * 10) / 10}`;
            data.over33Total = `${Math.round((data.over33Total / 60) * 10) / 10}`;
            data.over66Total = ` ${Math.round((data.over66Total / 60) * 10) / 10}`;
          }
        });
        return res.items;
      }));
  }
}
