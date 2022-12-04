import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, zip, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
const QueryAPI = environment.apiUrl + '/PunchService/GetDayoffList';
const InsertAPI = environment.apiUrl + '/PunchService/InsertDayoff';


export class GetDayoffListFormModel {
  memberId: number;
  year: number;
  month: number;
}

@Injectable({
  providedIn: 'root'
})
export class DayoffService extends BehaviorSubject<any[]> {
  public isLoading = false;
  public data: any[] = [];
  public originalData: any[] = [];
  public updatedItems: any[] = [];
  public hourSwitch = false;
  public fomrdata: GetDayoffListFormModel;

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
          data.dayoffDate = new Date(data.dayoffDate);
          data.startTime = new Date(data.startTime);
          data.endTime = new Date(data.endTime);
        });
        return res.items;
      }));
  }

  insertDayoffDetail(reqBody:any): Observable<any>{
    return this.http.post(InsertAPI,reqBody);
  }
}
