# 🏊 Olympic Academy Management System

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/olympic-academy)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Modules](#modules)
- [Installation & Setup](#installation--setup)
- [Quick Start](#quick-start)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact & Support](#contact--support)

---

## 🌟 Overview

**Olympic Academy Management System** is a comprehensive, enterprise-grade management solution designed specifically for swimming academies and sports training centers. Built with modern technologies and best practices, it provides a complete ecosystem for managing courses, trainees, trainers, enrollments, attendance, financial transactions, and reporting.

### Why Olympic Academy?

| Traditional Management | Olympic Academy System |
|------------------------|------------------------|
| ❌ Manual paper-based tracking | ✅ Digital end-to-end management |
| ❌ Spreadsheet chaos | ✅ Centralized database |
| ❌ Delayed reporting | ✅ Real-time analytics |
| ❌ Separate systems for each task | ✅ All-in-one platform |
| ❌ No mobile access | ✅ Responsive anywhere |
| ❌ Manual attendance tracking | ✅ Barcode/QR scanning |
| ❌ No financial oversight | ✅ Complete financial management |

---

## 🚀 Key Features

### 🏊 Course & Session Management
- **Dynamic Timetable View** - Visual display of sessions organized by day and time
- **Multi-Trainer Assignment** - Assign multiple trainers to a single session
- **Session Grouping** - Automatic grouping by course, day, and start time
- **Advanced Filtering** - Filter by course, trainer, place, status, day, date range
- **Real-time Availability** - Check trainer and venue availability instantly
- **Export Reports** - Export to Excel and PDF with professional formatting

### 📚 Trainee & Enrollment Management
- **Wizard-Based Enrollment** - Step-by-step enrollment process
- **Smart Trainee Cards** - Professional ID cards with barcodes
- **Bulk Operations** - Batch enrollment processing
- **Status Tracking** - Pending, Active, Completed, Cancelled
- **Payment Management** - Track payments with multiple statuses
- **Refund Processing** - Complete refund workflow

### ✅ Smart Attendance System
- **Fast Barcode Scanning** - QR/barcode scanning for instant check-in/out
- **Auto-Trainer Selection** - Automatically selects trainer from enrollment
- **Session Time Auto-fill** - Check-in/out times auto-populated
- **Multiple Status Options** - Present, Absent, Late, Excused
- **Daily/Period Reports** - Comprehensive attendance analytics
- **Print Certificates** - Professional attendance documents

### 💰 Financial Management
- **Salary & Incentive Wizard** - Multi-step salary processing
- **Employee Barcode Search** - Quick employee lookup via barcode
- **Multiple Salary Types** - Monthly, Hourly, Daily, Percentage
- **Payment Method Support** - Multiple payment methods
- **Real-time Calculations** - Automatic remaining salary updates
- **Complete Audit Trail** - Full transaction history

### 📊 Advanced Reporting & Analytics
- **Real-time Dashboard** - Live statistics and KPIs
- **Custom Reports** - Build custom reports with filters
- **Export Capabilities** - Excel and PDF exports with watermark
- **Financial Summaries** - Complete financial overview
- **Attendance Analytics** - Detailed attendance patterns
- **Performance Metrics** - Track trainer and trainee performance

---

## 🛠️ Technology Stack

### Frontend
│ • Angular 17 - Modern UI Framework │
│ • TypeScript - Type-safe development │
│ • Angular Material - Material Design UI │
│ • RxJS - Reactive programming │
│ • Chart.js - Interactive charts │
│ • jsPDF - PDF generation │
│ • jsBarcode - Barcode generation │
│ • HTML2Canvas - HTML to image conversion │


### Backend
│ • Spring Boot 3.2.0 - Enterprise Java │
│ • Spring Security - Authentication & Auth │
│ • JPA/Hibernate - Database ORM │
│ • JWT - Token-based security │
│ • MySQL 8.0 - Relational database │
│ • Liquibase - Database migrations │
│ • Mapstruct - Mapping framework   │
│ • Logback - Logging framework │
│ • Maven - Build tool │

### Deployment
│ • Portable JRE 17 - Self-contained Java │
│ • Portable Python 3.10 - Self-contained Python │
│ • Portable MySQL 8.0 - Self-contained DB │
│ • Batch Scripts - Easy start/stop │
│ • No installation - Portable & portable │
│ • Single click launch - User-friendly │


---

## 📦 Modules

### Core Modules

| Module                   | Description | Key Features |
|--------------------------|-------------|--------------|
| **Course Management**    | Manage courses and sessions | CRUD operations, timetable view, multi-trainer assignment |
| **Trainee Management**   | Manage trainees and enrollments | Enrollment wizard, ID cards, barcode generation |
| **Employee Management**  | Manage trainers and assignments | Schedule management, performance tracking |
| **Attendance Tracking**  | Track trainee attendance | Barcode scanning, auto-checkin, status tracking |
| **Financial Management** | Manage finances | Salary processing, payments, incentives, deductions |
| **User Management**      | Manage system users | Role-based access, permissions, authentication |
| **Reporting**            | Generate reports | Excel export, PDF export, analytics, dashboards |
| **Dashboard**            | System overview | Real-time stats, charts, KPIs, notifications |

### Detailed Module Features

#### 📚 Course Management
- Create, update, delete courses
- Assign trainers to courses
- Manage course sessions with timetable
- Filter sessions by day, time, trainer
- View session details with trainer info
- Export course schedules

#### 🏊 Session Management
- Create sessions with title, date, time
- Assign multiple trainers per session
- Auto-group by course, day, start time
- Session status tracking
- Place/location management
- Session notes and attachments

#### 👨‍🎓 Employee Management
- Complete Employee profile with photo
- Generate ID cards with barcodes
- Assign Courses
- Manage Salary 
- Attendance history
- Performance tracking

#### 👨‍🎓 Trainee Management
- Complete trainee profile with photo
- Generate ID cards with barcodes
- Track enrollment history
- Manage payment status
- Attendance history
- Performance tracking

#### 📋 Enrollment Management
- Wizard-based enrollment process
- Select course and trainer
- Configure payment schedule
- Track enrollment status
- Manage refunds
- Export enrollment reports

#### ✅ Attendance System
- Fast barcode/QR scanning
- Auto-populate from session
- Multiple attendance statuses
- Daily attendance reports
- Late tracking with minutes
- Attendance certificates

#### 💰 Financial Module
- Employee salary management
- Incentive and bonus processing
- Salary deduction management
- Payment method management
- Transaction history
- Financial reporting

---


MIT License

Copyright (c) 2026 CoreStack Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

📍 Location: Egypt
📱 Phone: 01069911181
📧 Email: m.ehab.rabea@gmail.com
