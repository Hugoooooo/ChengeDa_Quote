import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, zip, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DomainProvider } from 'src/providers/domainProvider';
import { DatePipe } from '@angular/common';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
const QueryAPI = environment.apiUrl + '/inventory/getShipOrderList';
const InsertAPI = environment.apiUrl + '/inventory/addShipOrder';
const UpdateAPI = environment.apiUrl + '/inventory/updateShipOrder';
const RemoveAPI = environment.apiUrl + '/inventory/removeShipOrder';
const GetInventoryAPI = environment.apiUrl + '/inventory/getInventoryStock';


export class GetListFormData {
  orderId: string;
  sDate: any;
  eDate: any;
}

@Injectable({
  providedIn: 'root'
})
export class ShipOrderService extends BehaviorSubject<any[]> {
  public isLoading = false;
  public data: any[] = [];
  public originalData: any[] = [];
  public updatedItems: any[] = [];
  public hourSwitch = false;
  public fomrdata: GetListFormData;

  constructor(private http: HttpClient, public domainProvider: DomainProvider, private datePipe: DatePipe) {
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
    let sDate = this.datePipe.transform(this.fomrdata.sDate, "yyyy/MM/dd 00:00:00");
    let eDate = this.datePipe.transform(this.fomrdata.eDate, "yyyy/MM/dd 23:59:59");
    const api = `${QueryAPI}?orderId=${this.fomrdata.orderId || ''}&sDate=${sDate || ''}&eDate=${eDate || ''}`;
    return this.http.get<any>(api)
      .pipe(map(res => {
        res.items.forEach(data => {
          data.shipDate = new Date(data.shipDate);
        });
        return res.items;
      }));
  }

  addPurchaseOrder(reqBody: any): Observable<any> {
    return this.http.post(InsertAPI, reqBody);
  }

  remove(reqBody: any): Observable<any> {
    return this.http.post(RemoveAPI, reqBody);
  }

  updatePurchaseOrder(reqBody: any): Observable<any> {
    return this.http.post(UpdateAPI, reqBody);
  }

  getInventoryStock(shipOrderId: any): Observable<any> {
    return this.http.get(`${GetInventoryAPI}${shipOrderId ? '?shipOrderId=' + shipOrderId : ''}`);
  }
}
