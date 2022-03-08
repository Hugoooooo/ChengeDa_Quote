import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { from, Observable, Subject } from 'rxjs';
import { TokenPrefix } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { APPPATH } from 'src/app/app-sitemap.const';
import { environment } from 'src/environments/environment';
@Injectable()
export class DomainProvider {

  constructor(
    public http: HttpClient,
    public router: Router,
    public spinner: NgxSpinnerService,
    private locationStrategy: LocationStrategy
  ) { }

  setStorage(token: string, value: string) {
    localStorage.setItem(TokenPrefix + token, value);
  }

  getStorage(token: string) {
    return localStorage.getItem(TokenPrefix + token);
  }

  getMerchantId() {
    return localStorage.getItem(TokenPrefix + 'id');
  }

  preventBack() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }


  removeStorage(token: string) {
    token = TokenPrefix + token;
    if (this.getStorage(token)) {
      localStorage.removeItem(token);
    }
  }

  clearStorage() {
    _.forIn(localStorage, (value: string, objKey: string) => {
      if (true === _.startsWith(objKey, TokenPrefix)) {
        window.localStorage.removeItem(objKey);
      }
    });
  }

  showMask() {
    this.spinner.show();
  }

  hideMask() {
    this.spinner.hide();
  }

  makeRandom(lengthOfCode: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-`';
    let result = '';
    for (let i = 0; i < lengthOfCode; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
  }

  removeArrayItem(targetArray, target) {
    const index = targetArray.indexOf(target);
    if (index > -1) {
      targetArray.splice(index, 1);
    }
    return targetArray;
  }

  getAllMenu(): Observable<any> {
    return from(new Promise(resolve => {
      resolve(JSON.parse(this.getStorage('menulist')));
    }));
  }

  goHomePage() {
    this.setStorage('menuMid', '0');
    this.setStorage('subMid', '0');
    this.router.navigate([APPPATH.Main + '/' + APPPATH.Dashboard]);
  }

  getPermission(): any {
    const menuId = this.getStorage('menuMid');
    const subMenuId = this.getStorage('subMid');
    const menuList = JSON.parse(this.getStorage('menulist') as string);
    // const targetMenu = menuList.filter(main => main.id == menuId)[0].subMenuInfos.find(sub => sub.id == subMenuId);
    // const addFlag = targetMenu.addFlag;
    // const updateFlag = targetMenu.updateFlag;
    // const deleteFlag = targetMenu.deleteFlag;
    return [true, true, true];
  }

  getRenewState(): boolean {
    return this.getStorage('isRenew') == '1';
  }

  addAuth() {
    return JSON.parse(this.getStorage('addFlag'));
  }

  updateAuth() {
    return JSON.parse(this.getStorage('updateFlag'));
  }

  deleteAuth() {
    return JSON.parse(this.getStorage('deleteFlag'));
  }

  transformImagePath(data: any) {
    data = data.replace(new RegExp('~/', 'g'), environment.apiUrl + '/');
    return data;
  }
  checkInterger(data) {
    return /^\d+$/.test(data.toString());
  }
  arrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }
}
