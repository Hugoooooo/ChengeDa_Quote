import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('rDiv', { static: false }) rDiv: ElementRef<HTMLElement>;

  display: boolean;
  collapse: boolean;

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.display = false;
    this.collapse = true;

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.rDiv.nativeElement.scrollTop = 0;
    });


    this.display = true;
  }

  // 開闔 sidebar
  collapseEvent(val: boolean): void {
    this.collapse = val;
  }

}
