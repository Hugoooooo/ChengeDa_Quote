import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quote-import',
  templateUrl: './quote-import.component.html',
  styleUrls: ['./quote-import.component.scss']
})
export class QuoteImportComponent implements OnInit {
  public caseNumber: any;
  @Output() saveItem = new EventEmitter<any>();

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }
  cancel(): void {
    this.activeModal.dismiss();
  }
  save():void{
    this.saveItem.emit(this.caseNumber);
    this.activeModal.dismiss();
  }
}
