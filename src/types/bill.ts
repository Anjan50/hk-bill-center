export interface Bill {
    receiptId: string;
    date: string;
    consumerNumber: string;
    customerName: string;
    electricityBill: number;
    gasBill: number;
    veraBill: number;
    total: number;
    status: string;
  }