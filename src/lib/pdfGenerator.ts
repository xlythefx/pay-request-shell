import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LinkBuildingData = {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  items: Array<{
    clientProjectType: string;
    selectedClientProject: string;
    customValue: string;
    description: string;
    amount: string;
  }>;
  note: string;
};

type SalaryData = {
  employeeName: string;
  employeeAddress: string;
  position: string;
  invoiceNumber: string;
  date: string;
  currency: string;
  items: Array<{ description: string; amount: string }>;
  paymentMethod: string;
};

type ToolsData = {
  toolName: string;
  toolCategory: string;
  paymentFrequency: string;
  currency: string;
  items: Array<{ description: string; amount: string }>;
  note: string;
};

type OtherWorkData = {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  workCategory: string;
  clientProjectType: string;
  description: string;
  amount: string;
  currency: string;
  note: string;
};

const addHeader = (doc: jsPDF, title: string) => {
  // Teal background from design system (172 30% 57%)
  doc.setFillColor(111, 182, 173);
  doc.rect(0, 0, doc.internal.pageSize.width, 50, "F");
  
  // Company name and logo area
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("Payment Request System", 20, 20);
  
  // Document title
  doc.setFontSize(14);
  doc.setFont(undefined, "normal");
  doc.text(title, 20, 35);
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
};

export const generateLinkBuildingPDF = (data: LinkBuildingData) => {
  const doc = new jsPDF();
  addHeader(doc, "Link Building & Content Invoice");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Invoice details
  let yPos = 60;
  doc.text(`Vendor Name: ${data.vendorName}`, 20, yPos);
  yPos += 10;
  doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, yPos);
  yPos += 10;
  doc.text(`Invoice Date: ${data.invoiceDate}`, 20, yPos);
  yPos += 10;
  doc.text(`Currency: ${data.currency}`, 20, yPos);
  yPos += 15;

  // Line items table
  const tableData = data.items.map((item) => {
    const clientProject =
      item.clientProjectType === "other"
        ? item.customValue
        : item.selectedClientProject;
    return [
      item.clientProjectType,
      clientProject,
      item.description,
      `${data.currency} ${parseFloat(item.amount || "0").toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Type", "Client/Project", "Description", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [111, 182, 173] },
  });

  // Total
  const total = data.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `Total Amount: ${data.currency} ${total.toFixed(2)}`,
    20,
    yPos
  );

  // Notes
  if (data.note) {
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Notes & Payment Method:", 20, yPos);
    yPos += 7;
    const splitNote = doc.splitTextToSize(data.note, 170);
    doc.text(splitNote, 20, yPos);
  }

  addFooter(doc);
  doc.save(`link-building-${data.invoiceNumber}.pdf`);
};

export const generateSalaryPDF = (data: SalaryData) => {
  const doc = new jsPDF();
  addHeader(doc, "Salary Payment Request");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Employee details
  let yPos = 60;
  doc.text(`Employee Name: ${data.employeeName}`, 20, yPos);
  yPos += 10;
  doc.text(`Position: ${data.position}`, 20, yPos);
  yPos += 10;
  doc.text(`Address: ${data.employeeAddress}`, 20, yPos);
  yPos += 10;
  doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, yPos);
  yPos += 10;
  doc.text(`Date: ${data.date}`, 20, yPos);
  yPos += 10;
  doc.text(`Currency: ${data.currency}`, 20, yPos);
  yPos += 15;

  // Line items table
  const tableData = data.items.map((item) => [
    item.description,
    `${data.currency} ${parseFloat(item.amount || "0").toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Description", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [111, 182, 173] },
  });

  // Total
  const total = data.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `Total Amount: ${data.currency} ${total.toFixed(2)}`,
    20,
    yPos
  );

  // Payment method
  if (data.paymentMethod) {
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Payment Method / Bank Details:", 20, yPos);
    yPos += 7;
    const splitMethod = doc.splitTextToSize(data.paymentMethod, 170);
    doc.text(splitMethod, 20, yPos);
  }

  addFooter(doc);
  doc.save(`salary-${data.invoiceNumber}.pdf`);
};

export const generateToolsPDF = (data: ToolsData) => {
  const doc = new jsPDF();
  addHeader(doc, "Tools & Software Request");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Tool details
  let yPos = 60;
  doc.text(`Tool Name: ${data.toolName}`, 20, yPos);
  yPos += 10;
  doc.text(`Tool Category: ${data.toolCategory}`, 20, yPos);
  yPos += 10;
  doc.text(`Payment Frequency: ${data.paymentFrequency}`, 20, yPos);
  yPos += 10;
  doc.text(`Currency: ${data.currency}`, 20, yPos);
  yPos += 15;

  // Line items table
  const tableData = data.items.map((item) => [
    item.description,
    `${data.currency} ${parseFloat(item.amount || "0").toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Description", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [111, 182, 173] },
  });

  // Total
  const total = data.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `Total Amount: ${data.currency} ${total.toFixed(2)}`,
    20,
    yPos
  );

  // Notes
  if (data.note) {
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Notes & Payment Method:", 20, yPos);
    yPos += 7;
    const splitNote = doc.splitTextToSize(data.note, 170);
    doc.text(splitNote, 20, yPos);
  }

  addFooter(doc);
  doc.save(`tools-${data.toolName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

export const generateOtherWorkPDF = (data: OtherWorkData) => {
  const doc = new jsPDF();
  addHeader(doc, "Other Work Invoice");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Work details
  let yPos = 60;
  doc.text(`Vendor Name: ${data.vendorName}`, 20, yPos);
  yPos += 10;
  doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, yPos);
  yPos += 10;
  doc.text(`Invoice Date: ${data.invoiceDate}`, 20, yPos);
  yPos += 10;
  doc.text(`Work Category: ${data.workCategory}`, 20, yPos);
  yPos += 10;
  doc.text(`Client/Project Type: ${data.clientProjectType}`, 20, yPos);
  yPos += 15;

  // Description and amount
  doc.setFont(undefined, "bold");
  doc.text("Description:", 20, yPos);
  yPos += 7;
  doc.setFont(undefined, "normal");
  const splitDesc = doc.splitTextToSize(data.description, 170);
  doc.text(splitDesc, 20, yPos);
  yPos += splitDesc.length * 7 + 10;

  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(
    `Amount: ${data.currency} ${parseFloat(data.amount || "0").toFixed(2)}`,
    20,
    yPos
  );

  // Notes
  if (data.note) {
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Notes & Payment Method:", 20, yPos);
    yPos += 7;
    const splitNote = doc.splitTextToSize(data.note, 170);
    doc.text(splitNote, 20, yPos);
  }

  addFooter(doc);
  doc.save(`other-work-${data.invoiceNumber}.pdf`);
};
