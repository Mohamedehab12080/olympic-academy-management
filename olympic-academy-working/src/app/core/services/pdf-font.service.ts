import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfFontService {
  private arabicFontLoaded = false;

  async addArabicFont(doc: jsPDF): Promise<void> {
    if (this.arabicFontLoaded) return;
    
    try {
      // Try to load Amiri font (you need to download this font)
      const fontUrl = '/assets/fonts/Amiri-Regular.ttf';
      const response = await fetch(fontUrl);
      const fontData = await response.arrayBuffer();
      
      // Convert to base64
      const fontBase64 = this.arrayBufferToBase64(fontData);
      
      // Add font to jsPDF
      doc.addFileToVFS('Amiri-Regular.ttf', fontBase64);
      doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
      doc.setFont('Amiri');
      this.arabicFontLoaded = true;
    } catch (error) {
      console.warn('Arabic font not loaded, using fallback', error);
      // Use a font that has some Arabic support
      doc.setFont('helvetica');
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}