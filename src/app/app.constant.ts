import { SweetAlertOptions } from 'sweetalert2';

// Grid 屬性
export const PageSize = { pageSizes: [10, 15, 20, 50, 100, 200, 500, 1000] };

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

