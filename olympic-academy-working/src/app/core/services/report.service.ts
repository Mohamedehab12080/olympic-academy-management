import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  /**
   * Helper function to safely extract display value from any object
   * Handles LookupVTO (with title property), strings, numbers, etc.
   */
  private getDisplayValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    // Handle LookupVTO (has title property)
    if (typeof value === 'object' && value.title) {
      return value.title;
    }
    // Handle numbers
    if (typeof value === 'number') {
      return value.toString();
    }
    // Handle strings
    if (typeof value === 'string' && value) {
      return value;
    }
    return '-';
  }

  /**
   * Helper function to safely extract numeric value
   */
  private getNumericValue(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  }

  // تصدير إلى Excel
  exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1'): void {
    // Process data to handle LookupVTO objects
    const processedData = data.map(row => {
      const processedRow: any = {};
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (value && typeof value === 'object' && value.title) {
          processedRow[key] = value.title;
        } else if (value && typeof value === 'object' && value.fullName) {
          processedRow[key] = value.fullName;
        } else {
          processedRow[key] = value;
        }
      });
      return processedRow;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedData);
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
        return this.getDisplayValue(value);
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
    doc.text(`إجمالي الموظفين: ${this.getNumericValue(attendanceData.totalEmployees)}`, 14, 45);
    doc.text(`الحضور: ${this.getNumericValue(attendanceData.present)}`, 14, 52);
    doc.text(`الغياب: ${this.getNumericValue(attendanceData.absent)}`, 14, 59);
    doc.text(`التأخير: ${this.getNumericValue(attendanceData.late)}`, 14, 66);
    doc.text(`المعذورين: ${this.getNumericValue(attendanceData.excused)}`, 14, 73);
    doc.text(`نسبة الحضور: ${this.getNumericValue(attendanceData.attendanceRate)}%`, 14, 80);
    
    autoTable(doc, {
      head: [['الموظف', 'حالة الحضور', 'وقت الدخول', 'وقت الخروج']],
      body: (attendanceData.details || []).map((d: any) => [
        d.employee?.fullName || d.employee?.title || '-',
        this.getDisplayValue(d.status),
        d.checkInTime || '-',
        d.checkOutTime || '-'
      ]),
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
        doc.text(`${total.label}: ${this.getNumericValue(total.value).toLocaleString()} جم`, 14, startY + (index * 7));
      });
      startY += (totals.length * 7) + 10;
    }
    
    autoTable(doc, {
      head: [headers],
      body: data.map(row => columns.map(col => {
        const value = row[col];
        return this.getDisplayValue(value);
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
      doc.text(`حالة الدفع: ${this.getDisplayValue(filters.paymentStatus)}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.enrollmentStatus) {
      doc.text(`حالة التسجيل: ${this.getDisplayValue(filters.enrollmentStatus)}`, 14, yOffset);
      yOffset += 7;
    }
    
    autoTable(doc, {
      head: [['#', 'المتدرب', 'الدورة', 'المدرب', 'تاريخ البدء', 'حالة التسجيل', 'حالة الدفع', 'المبلغ']],
      body: enrollments.map((e, i) => [
        (i + 1).toString(),
        this.getDisplayValue(e.trainee),
        this.getDisplayValue(e.course),
        this.getDisplayValue(e.trainer),
        e.startDate || '-',
        this.getDisplayValue(e.enrollmentStatus),
        this.getDisplayValue(e.paymentStatus),
        e.finalSubscriptionValue ? `${this.getNumericValue(e.finalSubscriptionValue).toLocaleString()} جم` : '-'
      ]),
      startY: yOffset + 10,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save(`enrollment-report.pdf`);
  }

  // تصدير تقرير عام للمتدربين
  exportTraineeReport(trainees: any[], filters: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير المتدربين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 35;
    
    if (filters.gender) {
      doc.text(`الجنس: ${this.getDisplayValue(filters.gender)}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.status) {
      doc.text(`الحالة: ${filters.status === 'active' ? 'نشط' : 'غير نشط'}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.academicYear) {
      doc.text(`السنة الدراسية: ${filters.academicYear}`, 14, yOffset);
      yOffset += 7;
    }
    
    doc.text(`عدد المتدربين: ${trainees.length}`, 14, yOffset + 7);
    
    autoTable(doc, {
      head: [['#', 'الاسم', 'رقم الهوية', 'السنة الدراسية', 'الجنس', 'الحالة']],
      body: trainees.map((t, i) => [
        (i + 1).toString(),
        t.fullName || '-',
        t.nationalId || '-',
        t.academicYear || '-',
        this.getDisplayValue(t.gender),
        t.isActive ? 'نشط' : 'غير نشط'
      ]),
      startY: yOffset + 20,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save('trainees-report.pdf');
  }

  // تصدير تقرير عام للموظفين
  exportEmployeeReport(employees: any[], filters: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير الموظفين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 35;
    
    if (filters.employeeType) {
      doc.text(`نوع الموظف: ${this.getDisplayValue(filters.employeeType)}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.gender) {
      doc.text(`الجنس: ${this.getDisplayValue(filters.gender)}`, 14, yOffset);
      yOffset += 7;
    }
    if (filters.status) {
      doc.text(`الحالة: ${filters.status === 'active' ? 'نشط' : 'غير نشط'}`, 14, yOffset);
      yOffset += 7;
    }
    
    doc.text(`عدد الموظفين: ${employees.length}`, 14, yOffset + 7);
    
    autoTable(doc, {
      head: [['#', 'الاسم', 'رقم الهوية', 'النوع', 'الجنس', 'تاريخ التوظيف', 'الحالة']],
      body: employees.map((e, i) => [
        (i + 1).toString(),
        e.fullName || '-',
        e.nationalId || '-',
        this.getDisplayValue(e.employeeType),
        this.getDisplayValue(e.gender),
        e.hireDate || '-',
        e.isActive ? 'نشط' : 'غير نشط'
      ]),
      startY: yOffset + 20,
      styles: { halign: 'right', font: 'helvetica', cellPadding: 3, fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' }
    });
    
    doc.save('employees-report.pdf');
  }
} 