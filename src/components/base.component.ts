import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { PageSize } from 'src/app/app.constant';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';


export abstract class BaseComponent {
  // kendo grid use
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public _PAGESIZE = PageSize;
  public mySelection: number[] = [];
  public filter: CompositeFilterDescriptor;
  public sort: SortDescriptor[] = [];

  // 列表頁起迄時間檢核
  checkStartAndEndTime(start: Date, end: Date): boolean{
    if (start > end) {
      this.showConfirmBtnAlert('error', '起始時間不能大於結束時間');
      return false;
    } else {
      return true;
    }
  }

  // 共用：產生一個確認按鈕的alert modal
  showConfirmBtnAlert(iconType: SweetAlertIcon, msg: string): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: iconType,
      confirmButtonText: '確定',
      title: '通知',
      html: msg,
    });
  }

  // 共用：產生一個確認+取消按鈕的alert modal
  showConfirmCancelBtnAlert(iconType: SweetAlertIcon, msg: string): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: '通知',
      icon: iconType,
      html: msg,
      showCancelButton: true,
      confirmButtonColor: '#005CAF',
      cancelButtonColor: '#909AB3',
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    });
  }

}
