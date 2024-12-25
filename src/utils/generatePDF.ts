import html2pdf from 'html2pdf.js';

interface BillData {
  receiptId: string;
  timestamp: string;
  consumerNumber: string;
  customerName: string;
  customerMobile: string;
  billType: string;
  provider: string;
  amount: string;
  status: string;
}

interface PdfOptions {
  margin: number;
  filename: string;
  image: {
    type: 'jpeg';
    quality: number;
  };
  html2canvas: {
    scale: number;
    letterRendering: boolean;
    useCORS: boolean;
  };
  jsPDF: {
    unit: 'mm';
    format: string | [number, number];
    orientation: 'portrait' | 'landscape';
  };
}

const createReceiptHtml = (billData: BillData): string => {
  return `
    <div id="receipt" style="width: 100%; max-width: 210mm; margin: 0; padding: 10px; font-family: Arial, sans-serif;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px;">
        <div>${new Date().toLocaleString()}</div>
        <div>Print</div>
      </div>
      <div style="margin-bottom: 15px;">
        <div style="font-size: 14px; font-weight: bold;">Transaction Receipt</div>
        <div style="font-size: 12px; margin-top: 5px;">Thank You For Transacting at HK BILL CENTER</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 10px;">
        <tr>
          <th>MERCHANT</th>
          <th>OPERATOR</th>
          <th>Customer Name</th>
          <th>Customer Mobile</th>
        </tr>
        <tr>
          <td>HK Bill Centre<br />[${billData.consumerNumber}]</td>
          <td>${billData.provider}</td>
          <td>${billData.customerName || 'Customer Not Found'}</td>
          <td>${billData.customerMobile}</td>
        </tr>
      </table>
      <div style="text-align: center; font-size: 12px;">Thank you For Using HK BILL CENTER</div>
    </div>
  `;
};

export const generatePDF = async (billData: BillData): Promise<void> => {
  try {
    const container = document.createElement('div');
    container.innerHTML = createReceiptHtml(billData);
    document.body.appendChild(container);

    const options: PdfOptions = {
      margin: 0,
      filename: `bill-${billData.receiptId}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1,
      },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4', // Use a string format instead of a tuple
        orientation: 'landscape',
      },
    };

    await html2pdf()
      .set(options as any) // Type assertion to suppress the error
      .from(container)
      .save();

    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};