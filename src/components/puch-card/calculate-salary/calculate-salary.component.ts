import { Component, OnInit } from '@angular/core';
import { GetPunchListFormModel } from 'src/services/punch-record.service';
import { PunchService } from 'src/services/punch.service';

@Component({
  selector: 'app-calculate-salary',
  templateUrl: './calculate-salary.component.html',
  styleUrls: ['./calculate-salary.component.scss']
})
export class CalculateSalaryComponent implements OnInit {
  public yearDDL = [];
  public monthDDL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public memberDDL: any;
  public formData: GetPunchListFormModel;
  public pageData:any;
  constructor(
    public punchService: PunchService,
  ) { }

  ngOnInit() {
    this.pagePrepare();
    this.punchService.getMemberDDL().subscribe(p => {
      this.memberDDL = p;
    });
  }


  pagePrepare() {
    this.formData = new GetPunchListFormModel();
    this.formData.year = new Date().getFullYear();
    this.formData.month = new Date().getMonth()+1;
    for (var i = 1; i <= 30; i++) {
      let year = new Date().getFullYear() - 2;
      this.yearDDL.push(year + i);
    }
  }

  search(){
    let reqItem ={
      memberId:this.formData.memberId,
      year:this.formData.year,
      month:this.formData.month
    };
    this.punchService.calcMonthSalary(reqItem).subscribe(ret=>{
      this.pageData = ret;
      this.pageData.regularTotalHR = Math.round((this.pageData.regularTotal / 60) * 10) / 10
      this.pageData.annualDayoffMinsHR = Math.round((this.pageData.annualDayoffMins / 60) * 10) / 10
      this.pageData.sickDayoffMinsHR = Math.round((this.pageData.sickDayoffMins / 60) * 10) / 10
      this.pageData.personalDayoffMinsHR = Math.round((this.pageData.personalDayoffMins / 60) * 10) / 10
      this.pageData.annualHoursHR = Math.round((this.pageData.annualHours / 60) * 10) / 10
      this.pageData.overtimeMinsHR = Math.round((this.pageData.overtimeMins / 60) * 10) / 10

      console.log(ret);
    })
  }

  reset(){

  }


}
