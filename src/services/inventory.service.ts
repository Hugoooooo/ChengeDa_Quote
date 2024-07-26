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
const QueryAPI = environment.apiUrl + '/inventory/getInventoryList';
const GetPurchaseOrderAPI = environment.apiUrl + '/inventory/getPurchaseOrderById?orderId=';
const GetShipOrderAPI = environment.apiUrl + '/inventory/getShipOrderById?orderId=';
const ImportAPI = environment.apiUrl + '/inventory/importInventory';
const PreSaleAPI = environment.apiUrl + '/inventory/updatePreSaleFlag';


export class GetListFormData {
  pattern: string;
  machineId: any;
  status: any;
  brand: any;
}
@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BehaviorSubject<any[]> {
  public aaa = 123;
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
    let status = this.fomrdata.status == '全部' ? '': this.fomrdata.status;
    const api = `${QueryAPI}?brand=${this.fomrdata.brand || ''}&pattern=${this.fomrdata.pattern || ''}&machineId=${this.fomrdata.machineId || ''}&status=${status || ''}`;
    return this.http.get<any>(api)
      .pipe(map(res => {
        res.items.forEach(data => {
          data.preSale = data.preSaleFlag? 'V' : '';
          data.purchaseDate = new Date(data.purchaseDate);
        });
        console.log(res.items);
        return res.items;
      }));
  }

  getPurchaseOrder(orderId: any): Observable<any> {
    return this.http.get<any>(GetPurchaseOrderAPI + orderId)
      .pipe(map(res => {
        res.detail.purchaseDate = new Date(res.detail.purchaseDate);
        return res.detail;
      }));
  }

  getShipOrder(orderId: any): Observable<any> {
    return this.http.get<any>(GetShipOrderAPI + orderId)
      .pipe(map(res => {
        if (res.detail) {
          res.detail.shipDate = new Date(res.detail.shipDate);
        }
        return res.detail;
      }));
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ImportAPI, data)
      .pipe(map(res => {
        let isSuccess = !res.isError;
        Swal.fire({
          confirmButtonText: '確定',
          icon: isSuccess ? 'success' : 'error',
          title: '通知',
          html: res.message
        });
        return res.items;
      }));
  }

  preSale(data: any): Observable<any> {
    return this.http.post<any>(PreSaleAPI, data)
      .pipe(map(res => {
        let isSuccess = !res.isError;
        Swal.fire({
          confirmButtonText: '確定',
          icon: isSuccess ? 'success' : 'error',
          title: '通知',
          html: res.message
        });
        return res;
      }));
  }

}
