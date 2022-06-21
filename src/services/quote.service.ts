import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, zip, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';

const QueryAPI = environment.apiUrl + '/QuoteService/GetQuote?caseNumber=';
const ExportAPI = environment.apiUrl + '/QuoteService/Export';
const PreviewAPI = environment.apiUrl + '/QuoteService/Preview';

@Injectable({
  providedIn: 'root'
})
export class QuoteService extends BehaviorSubject<any[]> {


  constructor(private http: HttpClient, public domainProvider: DomainProvider) {
    super([]);
  }

  getQuote(caseNumber: any): Observable<any> {
    return this.http.get(QueryAPI + caseNumber)
      .pipe(map(result => {
        return result;
      }))
  }

  export(reqBody: any): Observable<any> {
    return this.http.post(ExportAPI, reqBody, { responseType: 'blob' });
  }

  preview(reqBody: any): Observable<any> {
    return this.http.post(PreviewAPI, reqBody, { responseType: 'blob' });
  }
}
