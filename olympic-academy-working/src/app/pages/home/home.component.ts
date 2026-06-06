import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container" style="padding: 20px;">
      <h1 style="color: #2563eb; text-align: center;">🏊 الأكاديمية الأولمبية</h1>
      <p style="text-align: center; font-size: 18px;">تم تشغيل النظام بنجاح!</p>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 40px;">
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h2>24</h2>
          <p>الدورات</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h2>156</h2>
          <p>المتدربين</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h2>18</h2>
          <p>الموظفين</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h2>28,450 ر.س</h2>
          <p>الإيرادات</p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}