import { Component, OnInit } from '@angular/core';
import { DomainProvider } from 'src/providers/domainProvider';
import { Router } from '@angular/router';
import { APPPATH } from 'src/app/app-sitemap.const';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
    public router: Router,
    public domainProvider: DomainProvider
  ) { }

  ngOnInit(): void {
        this.form = new FormGroup({
      account: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  // login(): void {
  //   this.domainProvider.showMask();
  //   setTimeout(() => {
  //     this.router.navigate([APPPATH.Main + '/' + APPPATH.Dashboard]);
  //     this.domainProvider.hideMask();
  //   }, 1500);
  // }

  async onLogIn() {
    this.domainProvider.showMask();
    this.authService.login(this.form.value).subscribe((rsp) => {
      this.domainProvider.hideMask();
      if (rsp.isError) {
        Swal.fire({title: "登入失敗", icon: "error", text: rsp.message});
      } else {
        Swal.fire({title: "登入成功", icon: "success"}).then(() => {
          localStorage.setItem('userInfo', JSON.stringify(rsp));
          this.router.navigate([APPPATH.Main + '/' + APPPATH.Inventory + '/' + APPPATH.InventoryFlow.InventoryList]);
        });
      }
    });
  }

}
