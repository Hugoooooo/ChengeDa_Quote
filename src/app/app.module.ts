import { QuoteExportComponent } from './../components/quote-manage/quote-export/quote-export/quote-export.component';
import { LoginComponent } from 'src/components/login/login.component';
import { DashboardComponent } from './../components/dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DomainProvider } from 'src/providers/domainProvider';
import { DatePipe, CommonModule } from '@angular/common';
import { TopbarComponent } from 'src/components/shared/topbar/topbar.component';
import { SidebarComponent } from 'src/components/shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from 'src/components/shared/breadcrumb/breadcrumb.component';
import { MainComponent } from 'src/components/shared/main/main.component';
import { DatetimeMessageComponent } from 'src/components/shared/datetime-message/datetime-message.component';
import { GridFilterMessageComponent } from 'src/components/shared/grid-filter-message/grid-filter-message.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule } from '@progress/kendo-angular-intl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MultiSelectModule, DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MaterialSharedModule } from './material-shared.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    TopbarComponent,
    SidebarComponent,
    BreadcrumbComponent,
    MainComponent,
    DatetimeMessageComponent,
    GridFilterMessageComponent,
    QuoteExportComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IntlModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GridModule,
    NgxSpinnerModule,
    PDFModule,
    PDFExportModule,
    ButtonsModule,
    InputsModule,
    MultiSelectModule,
    ExcelModule,
    DateInputsModule,
    DatePickerModule,
    PopupModule,
    NgbModule,
    MaterialSharedModule,
    DropDownsModule
  ],
  providers: [
    DatePipe,
    DomainProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
