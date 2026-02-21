# 🚛 FleetFlow  
### Modular Fleet & Logistics Management System

FleetFlow is a centralized, rule-based digital fleet management system designed to replace inefficient manual logbooks and optimize the complete lifecycle of a delivery fleet.

It provides structured workflow management for vehicles, drivers, dispatching, maintenance, financial tracking, and analytics — all within a modular ERP-style architecture.

---

## 📌 Objective

To build a scalable logistics management system that:

- Optimizes fleet utilization
- Enforces safety & compliance rules
- Tracks operational and fuel expenses
- Automates vehicle-driver state transitions
- Provides actionable analytics for decision-making

---

## 👥 Target Users

- **Fleet Managers** – Monitor fleet health & lifecycle  
- **Dispatchers** – Create and manage trips  
- **Safety Officers** – Track compliance & license validity  
- **Financial Analysts** – Monitor costs, ROI & fuel efficiency  

---

## 🏗 Core Modules

### 1️⃣ Authentication & Role-Based Access

- Secure login  
- Role-based permissions (RBAC)

---

### 2️⃣ Command Center Dashboard

**At-a-glance KPIs:**

- Active Fleet  
- Maintenance Alerts  
- Utilization Rate  
- Pending Cargo  

**Filters:**
- Vehicle Type  
- Status  
- Region  

---

### 3️⃣ Vehicle Registry (Asset Management)

- Add / Update / Remove vehicles  

**Tracked Data:**
- Model  
- License Plate (Unique ID)  
- Max Load Capacity  
- Odometer  
- Status (Available, On Trip, In Shop, Retired)

---

### 4️⃣ Trip Dispatcher

**Workflow Lifecycle:**


**Validation Rules:**

- Cargo weight must not exceed vehicle capacity  
- Driver must have a valid license  
- Driver & vehicle must be available  

---

### 5️⃣ Maintenance & Service Logs

- Preventative & reactive service tracking  
- Automatically sets vehicle status to **In Shop**  
- Removes vehicle from dispatch pool  

---

### 6️⃣ Fuel & Expense Tracking

- Log fuel liters, cost, and date  

**Operational Cost Calculation:**


---

### 7️⃣ Driver Performance & Compliance

- License expiry tracking (Blocks assignment if expired)  
- Completion rate  
- Safety score  

**Duty Status:**
- On Duty  
- Off Duty  
- Suspended  

---

### 8️⃣ Operational Analytics & Reports

**Metrics Include:**

---

### 9️⃣ Netlify Deployement Link

Link - https://chimerical-dieffenbachia-98f5e3.netlify.app/

