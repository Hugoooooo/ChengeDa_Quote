import { ProductSeries, Business } from './../../../../app/app.constant';
import { Component, OnInit } from '@angular/core';
import { DomainProvider } from 'src/providers/domainProvider';
import { QuoteModel } from 'src/models/form/form.model';
import { BaseComponent } from 'src/components/base.component';
import * as _ from 'lodash';
import { HitachiProdcuts } from 'src/app/app.constant';

@Component({
  selector: 'app-quote-export',
  templateUrl: './quote-export.component.html',
  styleUrls: ['./quote-export.component.scss']
})
export class QuoteExportComponent extends BaseComponent implements OnInit {
  public project;
  public business;
  public name;
  public contactName;
  public cellPhone;
  public phone;
  public quoteList: Array<QuoteModel>;
  public dataItems;
  public businessDDL = Business;
  constructor(
    public domainProvider: DomainProvider
  ) {
    super();
  }

  ngOnInit() {
    this.quoteList = [];
    this.dataItems = [];
    this.dataItems = this.dataItems.concat(ProductSeries); // 標題
    this.dataItems = this.dataItems.concat(HitachiProdcuts); // 日立
    this.addQuote();
    // this.domainProvider.showMask();
  }

  addQuote(): void {
    const addItem = new QuoteModel();
    addItem.quantity = 1;
    addItem.productList = _.cloneDeep(this.dataItems);
    this.quoteList.push(addItem);
  }

  // 移除條件
  removeItem(index: number): void {
    this.quoteList.splice(index, 1);
  }

  calcAmount(quote: QuoteModel) {
    quote.amount = quote.quantity * quote.unitPrice;
  }

  onAutoInputFilter(autoValue: string, quote: QuoteModel): void {
    quote.productList = this.dataItems.filter(item => item.toLocaleLowerCase().indexOf(autoValue.toLowerCase()) !== -1);
  }

  reset() {
    this.quoteList = [];
    this.name = '';
    this.contactName = '';
    this.cellPhone = '';
    this.phone = '';
  }

  export() {
    console.log(this.quoteList);
  }
}
