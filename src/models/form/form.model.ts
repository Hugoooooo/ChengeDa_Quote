export class QuoteModel {
  product: string;
  quantity: number;
  pattern: string;
  unit_price: number;
  amount: number;
  remark: string;
  idx: number;
}

// 標籤進行編輯 拿到此標籤資訊顯示在編輯畫面
export class QuoteExportReqModel {
  project_name: string;
  customer_name: string;
  customer_address: string;
  contact_name: string;
  mobile: string;
  phone: string;
  companyTax: string;
  fax: string;
  create_user: string;
  items: Array<QuoteModel>; // 條件 提供標籤編輯使用
  fax_type: string;
}

// 條件標籤 新增 || 編輯 變換標籤屬性時須提供對應的欄位條件 結果
export class QuoteViewModel extends QuoteModel {
  productList: any;
}

export class CardRecordModel {
  punchDate: string;
  onWork: string;
  offWork: string;
  isHoliday: boolean;
  isFillDay: boolean;
}

export class DayoffEditModel{
  memberId :number;
  type: string;
  isAllDay:boolean;
  offDate: any;
  startDate: any;
  endDate: any;
}
