import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // تصدير إلى Excel
  exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1'): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { [sheetName]: worksheet }, SheetNames: [sheetName] };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  // تصدير إلى PDF (النسخة المصححة)
  exportToPDF(
    title: string,
    columns: string[],
    data: any[],
    fileName: string,
    headers?: string[]
  ): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // إضافة عنوان
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // إضافة التاريخ
    doc.setFontSize(10);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 35);
    
    // إنشاء الجدول
    autoTable(doc, {
      head: [headers || columns],
      body: data.map(row => columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') return value.toString();
        return value;
      })),
      startY: 45,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });
    
    doc.save(`${fileName}.pdf`);
  }

  // تصدير تقرير الحضور اليومي
  exportAttendanceReport(attendanceData: any, date: string): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text(`تقرير الحضور اليومي`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`التاريخ: ${date}`, 14, 35);
    doc.text(`إجمالي الموظفين: ${attendanceData.totalEmployees || 0}`, 14, 45);
    doc.text(`الحضور: ${attendanceData.present || 0}`, 14, 52);
    doc.text(`الغياب: ${attendanceData.absent || 0}`, 14, 59);
    doc.text(`التأخير: ${attendanceData.late || 0}`, 14, 66);
    doc.text(`المعذورين: ${attendanceData.excused || 0}`, 14, 73);
    doc.text(`نسبة الحضور: ${attendanceData.attendanceRate || 0}%`, 14, 80);
    
    autoTable(doc, {
      head: [['الموظف', 'حالة الحضور', 'وقت الدخول', 'وقت الخروج']],
      body: attendanceData.details?.map((d: any) => [
        d.employee?.fullName || '-',
        d.status?.title || '-',
        d.checkInTime || '-',
        d.checkOutTime || '-'
      ]) || [],
      startY: 90,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save(`attendance-report-${date}.pdf`);
  }

  // تصدير تقرير مالي
  exportFinancialReport(
    title: string,
    data: any[],
    columns: string[],
    headers: string[],
    totals?: { label: string; value: number }[]
  ): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 35);
    
    let startY = 45;
    
    if (totals && totals.length) {
      doc.setFontSize(12);
      totals.forEach((total, index) => {
        doc.text(`${total.label}: ${total.value.toLocaleString()} ريال`, 14, startY + (index * 7));
      });
      startY += (totals.length * 7) + 10;
    }
    
    autoTable(doc, {
      head: [headers],
      body: data.map(row => columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'object') return value?.title || '-';
        return value;
      })),
      startY,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save(`${title.replace(/\s/g, '-')}.pdf`);
  }

  // تصدير تقرير التسجيلات
  exportEnrollmentReport(enrollments: any[], filters: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير التسجيلات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    let yOffset = 35;
    
    if (filters.startDate) {
      doc.text(`من تاريخ: ${filters.startDate}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.endDate) {
      doc.text(`إلى تاريخ: ${filters.endDate}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.paymentStatus) {
      doc.text(`حالة الدفع: ${filters.paymentStatus}`, 14, yOffset);
      yOffset += 7;
    }
    
    autoTable(doc, {
      head: [['#', 'المتدرب', 'الدورة', 'المدرب', 'تاريخ البدء', 'حالة الدفع', 'المبلغ']],
      body: enrollments.map((e, i) => [
        (i + 1).toString(),
        e.trainee?.title || '-',
        e.course?.title || '-',
        e.trainer?.title || '-',
        e.startDate || '-',
        e.paymentStatus?.title || '-',
        e.finalSubscriptionValue ? `${e.finalSubscriptionValue.toLocaleString()} ريال` : '-'
      ]),
      startY: yOffset + 10,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save(`enrollment-report.pdf`);
  }
}