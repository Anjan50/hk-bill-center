import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';

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

export const generatePDF = (billData: BillData) => {
  // Create the HTML content
  const content = `
    <div id="receipt" style="width: 210mm; padding: 20px; font-family: Arial, sans-serif; color: black;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px;">
        <span>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span>
        <span>Print</span>
      </div>

      <!-- Title -->
      <div style="margin-bottom: 20px;">
        <div style="font-weight: bold; font-size: 14px;">Transaction Receipt</div>
        <div style="font-size: 12px; margin-top: 5px;">Thank You For Transacting at HK BILL CENTER</div>
      </div>

      <!-- First Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
        <tr>
          <th style="border: 1px solid black; padding: 8px; text-align: left; width: 25%;">MERCHANT</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left; width: 25%;">OPERATOR</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left; width: 25%;">Customer Name</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left; width: 25%;">Customer Mobile</th>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px;">
            HK Bill Centre<br/>
            [${billData.consumerNumber}]
          </td>
          <td style="border: 1px solid black; padding: 8px;">${billData.provider}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.customerName}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.customerMobile}</td>
        </tr>
      </table>

      <!-- Second Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
        <tr>
          <th style="border: 1px solid black; padding: 8px; text-align: left;">TIMESTAMP</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left;">Form No</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left;">VALUE (Rs.)</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left;">STATUS</th>
          <th style="border: 1px solid black; padding: 8px; text-align: left;">REFERENCE ID</th>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${billData.timestamp}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.consumerNumber}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.amount}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.status}</td>
          <td style="border: 1px solid black; padding: 8px;">${billData.receiptId}</td>
        </tr>
      </table>

      <!-- Footer -->
      <div style="text-align: center; font-size: 12px; margin-top: 20px;">
        Thank you For Using HK BILL CENTER
      </div>
    </div>
  `;

  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = content;
  document.body.appendChild(container);

  // Configure html2pdf options
  const opt = {
    margin: 1,
    filename: `bill-${billData.receiptId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      letterRendering: true,
      useCORS: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  // Generate PDF and trigger print
  return html2pdf()
    .set(opt)
    .from(container)
    .toPdf()
    .get('pdf')
    .then((pdf: jsPDF) => {
      document.body.removeChild(container);
      
      // Auto print
      pdf.autoPrint();
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      return pdf;
    });
};