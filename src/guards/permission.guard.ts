import { DomainProvider } from 'src/providers/domainProvider';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    public domainProvider: DomainProvider,
    public router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      // 使用者權限
      const permissionList = this.domainProvider.getPermission();
      this.domainProvider.setStorage('addFlag', permissionList[0]);
      this.domainProvider.setStorage('updateFlag', permissionList[1]);
      this.domainProvider.setStorage('deleteFlag', permissionList[2]);
      observer.next(true);
      observer.complete();
    });
  }
}

