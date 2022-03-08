import { NgModule } from '@angular/core';
import { MultiSelectModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { DateInputsModule, DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  // 集中第三方元件庫的模組
  exports: [
    MultiSelectModule,
    DropDownListModule,
    ExcelModule,
    GridModule,
    DateInputsModule,
    DatePickerModule,
    PopupModule,
    NgbModule,
    BrowserAnimationsModule
  ]
})
export class MaterialSharedModule { }
