import { Component, OnInit } from '@angular/core';
import { DomainProvider } from 'src/providers/domainProvider';
import { Router } from '@angular/router';
import { APPPATH } from 'src/app/app-sitemap.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public router: Router,
    public domainProvider: DomainProvider
  ) { }

  ngOnInit(): void {
    this.domainProvider.hideMask();
    this.domainProvider.clearStorage();
  }

  login(): void {
    this.domainProvider.showMask();
    setTimeout(() => {
      this.router.navigate([APPPATH.Main + '/' + APPPATH.Dashboard]);
      this.domainProvider.hideMask();
    }, 1500);
  }

}
