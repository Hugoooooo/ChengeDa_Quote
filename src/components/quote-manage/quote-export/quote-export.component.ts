import { QuoteImportComponent } from './../quote-import/quote-import.component';
import { Component, OnInit } from '@angular/core';
import { DomainProvider } from 'src/providers/domainProvider';
import { QuoteExportReqModel, QuoteModel, QuoteViewModel } from 'src/models/form/form.model';
import { BaseComponent } from 'src/components/base.component';
import * as _ from 'lodash';
import { Business, HitachiProdcuts, ProductSeries } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from 'src/services/quote.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quote-export',
  templateUrl: './quote-export.component.html',
  styleUrls: ['./quote-export.component.scss']
})
export class QuoteExportComponent extends BaseComponent implements OnInit {
  public form: QuoteExportReqModel;
  public quoteList: Array<QuoteViewModel>;
  public dataItems;
  public businessDDL = Business;
  constructor(
    public modalService: NgbModal,
    public domainProvider: DomainProvider,
    public quoteService: QuoteService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit() {
    this.reset();
    this.dataItems = [];
    this.dataItems = this.dataItems.concat(ProductSeries); // 標題
    this.dataItems = this.dataItems.concat(HitachiProdcuts); // 日立
    this.addQuote();
    // this.domainProvider.showMask();
  }

  addQuote(): void {
    const addItem = new QuoteViewModel();
    addItem.productList = _.cloneDeep(this.dataItems);
    this.quoteList.push(addItem);
  }


  // 移除條件
  removeItem(index: number): void {
    this.quoteList.splice(index, 1);
  }

  calcAmount(quote: QuoteModel) {
    quote.amount = quote.quantity * quote.unit_price;
  }

  onAutoInputFilter(autoValue: string, quote: QuoteViewModel): void {
    quote.productList = this.dataItems.filter(item => item.toLocaleLowerCase().indexOf(autoValue.toLowerCase()) !== -1);
  }

  reset() {
    this.form = new QuoteExportReqModel();
    this.form.fax_type = '1'; // 1: 內含 2: 外加
    this.quoteList = [];
  }

  import() {
    const modalRef = this.modalService.open(QuoteImportComponent, {
      backdrop: 'static',
      size: 'l',
      keyboard: false
    });
    modalRef.componentInstance.saveItem.subscribe((data) => {
      this.quoteService.getQuote(data).subscribe({
        next: (ret) => {
          const isSuccess = !ret.isError;
          Swal.fire({
            confirmButtonText: '確定',
            icon: isSuccess ? 'success' : 'error',
            title: ret.message,
            text: ''
          });
          if (isSuccess) {
            this.reset();
            this.form.fax_type = ret.fax_type;
            this.form.project_name = ret.project_name;
            this.form.customer_name = ret.customer_name;
            this.form.customer_address = ret.customer_address;
            this.form.contact_name = ret.contact_name;
            this.form.mobile = ret.mobile;
            this.form.phone = ret.phone;
            this.form.companyTax = ret.companyTax;
            this.form.fax = ret.fax;
            this.form.create_user = ret.create_user;
            ret.items = _.orderBy(ret.items,['idx'],['asc']);
            ret.items.forEach(item => {
              const addItem = new QuoteViewModel();
              addItem.amount = item.amount;
              addItem.pattern = item.pattern;
              addItem.product = item.product;
              addItem.quantity = item.quantity;
              addItem.remark = item.remark;
              addItem.unit_price = item.unit_price;
              addItem.idx = item.idx;
              addItem.productList = _.cloneDeep(this.dataItems);
              this.quoteList.push(addItem);
            });
          }
        }
      });
    });
  }

  preview() {
    this.domainProvider.showMask();
    this.form.items = this.mappingDetails();
    this.quoteService.preview(this.form).subscribe((data) => {
      this.domainProvider.hideMask();
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, 'blank');
    });
  }

  export() {
    this.domainProvider.showMask();
    this.form.items = this.mappingDetails();
    this.quoteService.export(this.form).subscribe((data) => {
      this.domainProvider.hideMask();
      var date = new Date();
      var fileName = this.datePipe.transform(date, "yyyyMMddHHmm") + '_' + this.form.customer_name + '_' + this.form.create_user + '.pdf';
      var file = new Blob([data], { type: 'application/pdf' })
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_self';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
    });
  }

  mappingDetails() {
    return this.quoteList.map(p => {
      var tmp = new QuoteModel();
      tmp.product = p.product;
      tmp.quantity = p.quantity;
      tmp.pattern = p.pattern;
      tmp.unit_price = p.unit_price;
      tmp.amount = p.amount;
      tmp.remark = p.remark;
      tmp.idx = p.idx;
      return tmp;
    })
  }
}
