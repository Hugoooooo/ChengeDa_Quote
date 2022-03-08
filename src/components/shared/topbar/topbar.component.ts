import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APPPATH } from 'src/app/app-sitemap.const';
import { environment } from 'src/environments/environment';
import { DomainProvider } from 'src/providers/domainProvider';
import Swal from 'sweetalert2';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() collapse: boolean;
  @Output() collapseEvent = new EventEmitter<any>();

  public version = environment.version;

  constructor(
    public domainProvider: DomainProvider,
    public router: Router
  ) { }

  clickMenu(): void {
    this.collapse = !this.collapse;
    this.collapseEvent.emit(this.collapse);
  }

  logout(): void {
    Swal.fire({
      title: '通知',
      html: '您要登出?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '確定登出',
      cancelButtonColor: '#909AB3',
      cancelButtonText: '取消登出'
    }).then((result) => {
      if (result.value) {
        this.domainProvider.clearStorage();
        this.router.navigate([APPPATH.Login]);
      }
    });
  }

}
