import { QuoteExportComponent } from './../components/quote-manage/quote-export/quote-export/quote-export.component';
import { DashboardComponent } from './../components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { APPPATH } from './app-sitemap.const';
import { LoginComponent } from 'src/components/login/login.component';
import { MainComponent } from 'src/components/shared/main/main.component';
import { AuthGuard } from 'src/guards/auth.guard';

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
