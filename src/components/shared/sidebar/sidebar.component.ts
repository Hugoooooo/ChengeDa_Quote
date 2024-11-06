import { DayoffListComponent } from './../../puch-card/dayoff-list/dayoff-list.component';
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
      attribute: 'icon-target',
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
    {
      id: 3,
      attribute: 'icon-check-box',
      name: '出缺勤管理',
      domain: APPPATH.PunchCard,
      subMenuInfos: [
        {
          id: 6,
          url: APPPATH.PuchCardFlow.CalculateSalary,
          name: '月薪計算'
        },
        {
          id: 4,
          url: APPPATH.PuchCardFlow.PuchCardRecord,
          name: '出缺勤紀錄'
        },
        {
          id: 5,
          url: APPPATH.PuchCardFlow.PuchCardEdit,
          name: '打卡編輯'
        },
        {
          id: 7,
          url: APPPATH.PuchCardFlow.DayoffList,
          name: '請假列表'
        }
      ]
    },
    {
      id: 4,
      attribute: 'icon-check-box',
      name: '進銷存管理',
      domain: APPPATH.Inventory,
      subMenuInfos: [
        {
          id: 6,
          url: APPPATH.InventoryFlow.InventoryList,
          name: '庫存列表'
        },
        {
          id: 7,
          url: APPPATH.InventoryFlow.PurchaseList,
          name: '進貨單列表'
        },
        {
          id: 8,
          url: APPPATH.InventoryFlow.ShipList,
          name: '出貨單列表'
        },
        {
          id: 9,
          url: APPPATH.InventoryFlow.CashOrderList,
          name: '出貨單收款'
        },
        {
          id: 10,
          url: APPPATH.InventoryFlow.CashRecordList,
          name: '收款紀錄'
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
    if (menuId == this.menuId) {
      this.menuId = -1;
    } else {
      this.menuId = menuId;
    }
  }

  // 前往頁面
  go(menuId: any, subMenuId: any, path: string, url: any): void {
    this.domainProvider.setStorage('menuMid', menuId);
    this.domainProvider.setStorage('subMid', subMenuId);
    this.router.navigate([this.main + path + '/' + url], { queryParams: { menuMid: menuId, subMid: subMenuId } });
  }

}
