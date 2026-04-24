# 🏘️ Barangay Management System

A comprehensive, real-time digital platform designed to modernize and streamline local government operations at the barangay level. This system bridges the gap between residents and barangay officials through automated workflows and centralized data management.

## 📌 What is this system for?

The **Barangay Management System** is a digital solution tailored for local communities in the Philippines. It serves as a unified hub for resident records, incident reporting, and public service requests. By transitioning from traditional paper-based methods to a robust web-based architecture, the system ensures data integrity, faster service delivery, and improved community engagement.

## ⚠️ The Problem

Many barangays still rely on manual, fragmented processes for day-to-day operations:
- **Inefficient Record-Keeping**: Documenting resident information in physical logbooks leads to data loss and slow retrieval.
- **Delayed Incident Response**: Reporting public disturbances or emergencies often requires physical presence, delaying resolution.
- **Tedious Document Processing**: Manual preparation of barangay clearances, certifications, and permits is slow and prone to human error.
- **Lack of Transparency**: Residents often have no real-time way to track their requests or report community issues.

## ✅ How it Solves the Problem

This system addresses these challenges by providing:
- **Digital Resident Database**: A centralized, searchable repository of all resident files for instant access and management.
- **Automated Document Generation**: One-click generation of certificates (e.g., Barangay Clearance, Indigency) using dynamic templates.
- **Real-time Incident Monitoring**: A live feed for reporting and tracking community incidents with status updates.
- **Self-Service Portal**: Residents can request documents and report issues from their own devices, reducing office congestion.

## 👥 Target Users

1.  **Barangay Officials & Staff (Admins)**: Manage resident records, process document requests, monitor incidents, and view community health/security dashboards.
2.  **Barangay Residents**: Access personalized accounts to request services, track status, and report community-related incidents without visiting the barangay hall.

## 🚀 Core Features

-   **Resident Management**: Complete CRUD operations for resident profiles with advanced filtering and search.
-   **Incident Reporting & Feed**: Residents can submit reports with titles and descriptions; Admins can track resolution status in real-time.
-   **Service Request Queue**: Management system for document requests (Clearance, Indigency, etc.) with automated status updates.
-   **Template Management**: Admin controls for document templates, allowing for customizable output formats.
-   **Document Preview & Export**: Generation of documents in `.docx` and `.pdf` formats using professional-grade templating.
-   **Real-time Dashboard**: Overview of total residents, pending requests, and active incidents.

## 🛠️ Tools & Libraries Used

### **Core Frameworks**
-   **Next.js (App Router)**: For server-side rendering, routing, and high-performance web architecture.
-   **React 19**: Utilizing the latest React features for a reactive and smooth user interface.
-   **TypeScript**: Ensuring type safety and maintainability across the codebase.

### **Backend & Database**
-   **Supabase**:
    -   **PostgreSQL**: For relational data storage.
    -   **Authentication**: Secure user login and role-based access control.
    -   **Real-time Features**: Instant UI updates for incident feeds and request queues.
    -   **Storage**: Secure hosting for document templates and resident attachments.

### **Styling & UI**
-   **Tailwind CSS v4**: Modern, utility-first styling for a premium aesthetic.
-   **Lucide React**: A suite of clean, consistent icons for enhanced UX.
-   **clsx & tailwind-merge**: Utilities for managing dynamic CSS classes.

### **Document Generation**
-   **docxtemplater & PizZip**: Powering the dynamic generation of `.docx` documents from templates.
-   **jsPDF**: Enabling high-quality PDF exports for official certifications.
-   **File-Saver**: Handling client-side file downloads seamlessly.

---
*Built with focus on performance, accessibility, and community impact.*
