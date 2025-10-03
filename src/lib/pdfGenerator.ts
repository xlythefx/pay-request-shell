import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LinkBuildingData = {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  status: "approved" | "pending" | "rejected";
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
  status: "approved" | "pending" | "rejected";
  items: Array<{ description: string; amount: string }>;
  paymentMethod: string;
};

type ToolsData = {
  toolName: string;
  toolCategory: string;
  paymentFrequency: string;
  currency: string;
  status: "approved" | "pending" | "rejected";
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
  status: "approved" | "pending" | "rejected";
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

const getStatusLabel = (status: "approved" | "pending" | "rejected"): string => {
  const statusMap = {
    approved: "Approved",
    pending: "On Hold",
    rejected: "Not Approved",
  };
  return statusMap[status];
};

const getStatusColor = (status: "approved" | "pending" | "rejected"): [number, number, number] => {
  const colorMap = {
    approved: [34, 197, 94] as [number, number, number], // green
    pending: [234, 179, 8] as [number, number, number],  // yellow
    rejected: [239, 68, 68] as [number, number, number], // red
  };
  return colorMap[status];
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

  // Status badge
  let yPos = 60;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(...statusColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  const statusLabel = getStatusLabel(data.status);
  const statusWidth = doc.getTextWidth(statusLabel) + 10;
  doc.roundedRect(20, yPos - 5, statusWidth, 8, 2, 2, "F");
  doc.text(statusLabel, 25, yPos);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");

  // Invoice details
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

  // Status badge
  let yPos = 60;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(...statusColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  const statusLabel = getStatusLabel(data.status);
  const statusWidth = doc.getTextWidth(statusLabel) + 10;
  doc.roundedRect(20, yPos - 5, statusWidth, 8, 2, 2, "F");
  doc.text(statusLabel, 25, yPos);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");

  // Employee details
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

  // Status badge
  let yPos = 60;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(...statusColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  const statusLabel = getStatusLabel(data.status);
  const statusWidth = doc.getTextWidth(statusLabel) + 10;
  doc.roundedRect(20, yPos - 5, statusWidth, 8, 2, 2, "F");
  doc.text(statusLabel, 25, yPos);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");

  // Tool details
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

  // Status badge
  let yPos = 60;
  const statusColor = getStatusColor(data.status);
  doc.setFillColor(...statusColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  const statusLabel = getStatusLabel(data.status);
  const statusWidth = doc.getTextWidth(statusLabel) + 10;
  doc.roundedRect(20, yPos - 5, statusWidth, 8, 2, 2, "F");
  doc.text(statusLabel, 25, yPos);
  
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, "normal");

  // Work details
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

// Department Financial Report Data Type
export interface DepartmentReportData {
  department: string;
  generatedBy: string;
  generatedAt: string;
  companyName: string;
  requests: Array<{
    id: number;
    type: string;
    vendorName?: string;
    employeeName?: string;
    toolName?: string;
    totalAmount: number;
    currency: string;
    status: "approved" | "pending" | "rejected";
    createdAt: string;
  }>;
}

export const generateDepartmentReportPDF = (data: DepartmentReportData) => {
  const doc = new jsPDF();
  
  // Company logo and name
  doc.setFillColor(197, 144, 51);
  doc.circle(20, 20, 8, "F");
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.setTextColor(197, 144, 51);
  doc.text(data.companyName, 32, 24);
  
  // Report title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Department Financial Report", 15, 45);
  
  let yPos = 55;
  
  // Report details
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Department: ${data.department}`, 15, yPos);
  yPos += 6;
  doc.text(`Generated by: ${data.generatedBy}`, 15, yPos);
  yPos += 6;
  doc.text(`Generated on: ${new Date(data.generatedAt).toLocaleString()}`, 15, yPos);
  yPos += 12;
  
  // Calculate totals and breakdown
  const breakdown = data.requests.reduce((acc, req) => {
    const typeKey = req.type.replace("_", " ");
    if (!acc[typeKey]) {
      acc[typeKey] = { count: 0, total: 0 };
    }
    acc[typeKey].count++;
    acc[typeKey].total += req.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);
  
  const grandTotal = data.requests.reduce((sum, req) => sum + req.totalAmount, 0);
  const approvedTotal = data.requests.filter(r => r.status === "approved").reduce((sum, req) => sum + req.totalAmount, 0);
  const pendingTotal = data.requests.filter(r => r.status === "pending").reduce((sum, req) => sum + req.totalAmount, 0);
  
  // Summary section
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Summary", 15, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Total Requests: ${data.requests.length}`, 15, yPos);
  yPos += 6;
  doc.text(`Grand Total: $${grandTotal.toLocaleString()}`, 15, yPos);
  yPos += 6;
  doc.text(`Approved: $${approvedTotal.toLocaleString()}`, 15, yPos);
  yPos += 6;
  doc.text(`Pending: $${pendingTotal.toLocaleString()}`, 15, yPos);
  yPos += 12;
  
  // Breakdown by type
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("Breakdown by Request Type", 15, yPos);
  yPos += 8;
  
  const breakdownData = Object.entries(breakdown).map(([type, data]) => [
    type.charAt(0).toUpperCase() + type.slice(1),
    data.count.toString(),
    `$${data.total.toLocaleString()}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [["Request Type", "Count", "Total Amount"]],
    body: breakdownData,
    theme: "grid",
    headStyles: { fillColor: [197, 144, 51], textColor: [13, 18, 21] },
    styles: { fontSize: 9 },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // All requests table
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("All Requests", 15, yPos);
  yPos += 8;
  
  const requestsData = data.requests.map(req => [
    req.id.toString(),
    req.type.replace("_", " ").charAt(0).toUpperCase() + req.type.replace("_", " ").slice(1),
    req.vendorName || req.employeeName || req.toolName || "N/A",
    `$${req.totalAmount.toLocaleString()} ${req.currency}`,
    req.status.charAt(0).toUpperCase() + req.status.slice(1),
    new Date(req.createdAt).toLocaleDateString()
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [["ID", "Type", "Vendor/Employee", "Amount", "Status", "Date"]],
    body: requestsData,
    theme: "grid",
    headStyles: { fillColor: [197, 144, 51], textColor: [13, 18, 21] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 }
    }
  });
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  // Save the PDF
  const fileName = `${data.department.toLowerCase().replace(/\s+/g, "-")}-financial-report-${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
