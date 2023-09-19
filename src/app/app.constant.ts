import { SweetAlertOptions } from 'sweetalert2';

// Grid 屬性
export const PageSize = { pageSizes: [10, 15, 20, 50, 100, 200, 500] };

export const TokenPrefix = 'G-';
export const SwalStopOption: SweetAlertOptions = {
  title: '通知',
  text: '確定要停用該筆資料?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#90c31e',
  cancelButtonColor: '#909AB3',
  confirmButtonText: '確定',
  cancelButtonText: '取消'
}

export const SwalDeleteOption: SweetAlertOptions = {
  title: '通知',
  text: '確定要刪除該筆資料?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#90c31e',
  cancelButtonColor: '#909AB3',
  confirmButtonText: '確定',
  cancelButtonText: '取消'
}
export const PuchaseTypeDDL = ['進貨','他地代送','自載'];
export const ShipTypeDDL = ['出貨','他地代收','他人自載'];
export const InventoryStatusDDL = ['','庫存','已出貨','已退貨'];

export const Business = [
  {
    text: '劉居政',
    value: '劉居政'
  },
  {
    text: '劉奇信',
    value: '劉奇信'
  }
];

export enum InventoryStatus {
  STOCK = '庫存',
  SHIPPED = '已出貨',
  RETURN = '已退貨',
}
