import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APPPATH } from 'src/app/app-sitemap.const';
import { DomainProvider } from 'src/providers/domainProvider';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuId;
  public subMenuId;

  main = APPPATH.Main + '/';

  public menuList = [
    {
      id: 1,
      attribute: 'icon-check-box',
      name: '報價管理',
      domain: APPPATH.QuoteManage,
      subMenuInfos: [
        {
          id: 2,
          url: APPPATH.QuoteManageFlow.QuoteExport,
          name: '匯出報價單'
        }
      ]
    },
  ];

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public domainProvider: DomainProvider,
  ) {
  }

  ngOnInit(): void {
    this.triggerActiveSideBar();
  }

  // 檢查當前頁面sidebar需展開的選項
  triggerActiveSideBar(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.menuMid && params.subMid) {
        this.menuId = params.menuMid;
        this.subMenuId = params.subMid;
        this.domainProvider.setStorage('menuMid', params.menuMid);
        this.domainProvider.setStorage('subMid', params.subMid);
      } else {
        this.menuId = this.domainProvider.getStorage('menuMid');
        this.subMenuId = this.domainProvider.getStorage('subMid');
      }
    });
  }

  // 點擊sidebar 選項
  openMenu(menuId: any): void {
    this.menuId = menuId;
  }

  // 前往頁面
  go(menuId: any, subMenuId: any, path: string, url: any): void {
    this.domainProvider.setStorage('menuMid', menuId);
    this.domainProvider.setStorage('subMid', subMenuId);
    this.router.navigate([this.main + path + '/' + url], { queryParams: { menuMid: menuId, subMid: subMenuId } });
  }

}
