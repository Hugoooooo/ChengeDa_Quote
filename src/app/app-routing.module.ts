import { DayoffEditComponent } from './../components/puch-card/dayoff-edit/dayoff-edit.component';
import { DayoffListComponent } from './../components/puch-card/dayoff-list/dayoff-list.component';
import { CalculateSalaryComponent } from './../components/puch-card/calculate-salary/calculate-salary.component';
import { PuchCardEditComponent } from './../components/puch-card/puch-card-edit/puch-card-edit.component';
import { QuoteImportComponent } from './../components/quote-manage/quote-import/quote-import.component';
import { DashboardComponent } from './../components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { APPPATH } from './app-sitemap.const';
import { LoginComponent } from 'src/components/login/login.component';
import { MainComponent } from 'src/components/shared/main/main.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { QuoteExportComponent } from 'src/components/quote-manage/quote-export/quote-export.component';
import { PuchCardRecordComponent } from 'src/components/puch-card/puch-card-record/puch-card-record.component';
import { PurchaseListComponent } from 'src/components/inventory/purchase-list/purchase-list.component';
import { ShipListComponent } from 'src/components/inventory/ship-list/ship-list.component';
import { InventoryListComponent } from 'src/components/inventory/inventory-list/inventory-list.component';

const routes: Routes = [
  { path: '', redirectTo: APPPATH.Login, pathMatch: 'full' },
  { path: APPPATH.Login, component: LoginComponent },
  {
    path: APPPATH.Main,
    component: MainComponent,
    data: {
      breadcrumb: '首頁'
    },
    children: [
      {
        path: APPPATH.Dashboard,
        component: DashboardComponent,
      },
      {
        path: APPPATH.QuoteManage,
        data: {
          breadcrumb: '報價管理'
        },
        children: [
          {
            path: APPPATH.QuoteManageFlow.QuoteExport,
            component: QuoteExportComponent,
            data: {
              breadcrumb: '匯出報價單'
            }
          },
          {
            path: APPPATH.QuoteManageFlow.QuoteImport,
            component: QuoteImportComponent,
            data: {
              breadcrumb: '載入報價單'
            }
          },
        ],
      },
      {
        path: APPPATH.PunchCard,
        data: {
          breadcrumb: '出缺勤管理'
        },
        children: [
          {
            path: APPPATH.PuchCardFlow.PuchCardRecord,
            component: PuchCardRecordComponent,
            data: {
              breadcrumb: '出缺勤紀錄'
            }
          },
          {
            path: APPPATH.PuchCardFlow.PuchCardEdit,
            component: PuchCardEditComponent,
            data: {
              breadcrumb: '新增打卡'
            }
          },
          {
            path: APPPATH.PuchCardFlow.CalculateSalary,
            component: CalculateSalaryComponent,
            data: {
              breadcrumb: '月薪計算'
            }
          },
          {
            path: APPPATH.PuchCardFlow.DayoffList,
            component: DayoffListComponent,
            data: {
              breadcrumb: '請假列表'
            }
          },
          {
            path: APPPATH.PuchCardFlow.DayoffEdit,
            component: DayoffEditComponent,
            data: {
              breadcrumb: '請假編輯'
            }
          },
        ],
      },
      {
        path: APPPATH.Inventory,
        data: {
          breadcrumb: '進銷存管理'
        },
        children: [
          {
            path: APPPATH.InventoryFlow.InventoryList,
            component: InventoryListComponent,
            data: {
              breadcrumb: '庫存列表'
            }
          },
          {
            path: APPPATH.InventoryFlow.PurchaseList,
            component: PurchaseListComponent,
            data: {
              breadcrumb: '進貨單列表'
            }
          },
          {
            path: APPPATH.InventoryFlow.ShipList,
            component: ShipListComponent,
            data: {
              breadcrumb: '出貨單列表'
            }
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: APPPATH.Login }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
