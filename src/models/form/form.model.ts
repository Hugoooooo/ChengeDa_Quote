export class Parameter {
  type: string;
  values: string[];
}

export class QuoteModel {
  product: string;
  quantity: number;
  pattern: string;
  unit_price: number;
  amount: number;
  remark: string;
  idx: number;
  unit: string;
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
  row: number;
  row_size: number;
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

export class DayoffEditModel {
  memberId: number;
  type: string;
  isAllDay: boolean;
  offDate: any;
  startDate: any;
  endDate: any;
}

export class AddPurchaseOrderModel {
  orderId: string;
  type: string;
  note: string;
  purchaseDate: string;
  items: AddPurchaseDetail[] = []
}

export class AddShipOrderModel {
  orderId: string;
  type: string;
  customer: string;
  amount: number;
  invoice_amount: number;
  taxType: string;
  invoice: string;
  note: string;
  shipDate: string;
  items: AddPurchaseDetail[] = [];
  inventoryIds: string[] = [];
}

export class UpdateShipOrderModel {
  orderId: string;
  type: string;
  status: string;
  customer: string;
  amount: number;
  invoice_amount: number;
  taxType: string;
  invoice: string;
  note: string;
  shipDate: string;
  inventoryIds: string[] = [];
}

export class AddPurchaseDetail {
  id: any;
  inventoryId: any;
  pattern: string;
  machineId: string;
  brand: string;
  price: number;
  constructor(brand: string = "") {
    this.brand = brand;
  }
}

export class InventroyPickModel {
  inventoryId: any;
  machineId: any;
  isPick: any;
  pattern: string;
  brand: string;
}

export class CashRecordDetail {
  id: any;
  amount: any;
  method: any;
  payDate: any;
  constructor(method: string = "", payDate) {
    this.method = method;
    this.payDate = payDate
  }
}
