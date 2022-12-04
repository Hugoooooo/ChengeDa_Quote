import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, zip, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

const MemberListAPI = environment.apiUrl + '/PunchService/GetMemberList';
const InsertPunchDetailAPI = environment.apiUrl + '/PunchService/InsertPunchDetail';
const GetPunchListAPI = environment.apiUrl + '/PunchService/GetPunchList';
const CalcSalaryAPI = environment.apiUrl + '/PunchService/CalcSalary';


@Injectable({
  providedIn: 'root'
})
export class PunchService extends BehaviorSubject<any[]> {

  constructor(private http: HttpClient, public domainProvider: DomainProvider) {
    super([]);
  }

  calcMonthSalary(reqBody:any): Observable<any> {
    return this.http.post(CalcSalaryAPI,reqBody)
      .pipe(map((result: any) => {
        return result;
      }))
  }

  getMemberDDL(): Observable<any> {
    return this.http.get(MemberListAPI)
      .pipe(map((res: any) => {
        var result = res.items.map(p => ({ text: p.name, value: p.id }));
        return result;
      }))
  }


  insertPunchDetail(reqBody:any): Observable<any>{
    return this.http.post(InsertPunchDetailAPI,reqBody);
  }


  getPunchList(): Observable<any> {
    return this.http.get(GetPunchListAPI)
      .pipe(map((res: any) => {
        return res;
      }))
  }
}
