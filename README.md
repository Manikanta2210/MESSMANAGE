# 🍲 Annapurna Mess Management System (MESSMANAGE)

A modern, full-stack inspired frontend web application for university campuses, hostels, and dining halls. The system is cleanly divided into two synchronized portals: **Customer Portal (Students & Residents)** and **Manager Portal (Hostel & Mess Staff)**.

---

## 🌟 Key Features

### 👨‍🎓 1. Customer / Student Portal
- **Live Menu Browsing**:
  - Filter by meal slots (**Breakfast**, **Lunch**, **Snacks**, **Dinner**).
  - Dietary preferences toggle (**Veg 🟢 / Non-Veg 🔴**).
  - Search dish by name, ingredients, or accompaniments.
  - View prices, calories, serving windows, and Chef's Special highlights.
- **Pay to Eat Checkout**:
  - Instant 1-click **"Pay to Eat"** on any dish, or multi-item **Tray (Cart)** checkout.
  - Dining preference: **Dine-in (Mess Hall)** or **Takeaway / Parcel 🥡**.
  - 3 Flexible payment channels:
    1. **Prepaid Mess Wallet** (Instant balance deduction).
    2. **Instant UPI / QR Code** (Zero extra fee instant simulation).
    3. **Add to Mess Dues (Pay Later / Student Credit)** (Adds to monthly dues ledger).
- **Digital Meal Pass / Token Generation**:
  - Generates verifiable passes (e.g., `TKN-042`) with QR code graphics, timestamp, and food items.
  - Students present this token at the serving counter to claim their food.
- **Dues Calculation & Ledger Statement**:
  - Transparent formula:
    $$\text{Net Outstanding Due} = \text{Total Consumed Meals} - \text{Total Settled Payments}$$
  - **"Clear Dues Now"** settlement modal (UPI / Card / Cash).
  * **"Top Up Mess Wallet"** modal with quick presets (₹100, ₹200, ₹500, ₹1000).
  * Comprehensive itemized transaction history table for every meal and payment.

---

### 🛡️ 2. Manager / Staff Portal
- **Daily Menu Management & Editor**:
  - **Add New Dish**: Set name, category, price in ₹, diet type, calories, serving window, description, and image URL.
  - **Edit Dish**: Update prices, descriptions, and timings in real time.
  - **Stock Availability Switch**: 1-click toggle between **"In Stock 🟢"** and **"Sold Out 🔴"** which immediately syncs to customer view.
  - **Delete Dish**: Remove items from today's menu.
- **Customer Dues Master Ledger**:
  - Comprehensive student dues table with name, roll number, room number, total meals taken, wallet balance, and outstanding dues.
  - **Defaulter Alerts**: Automatic red badges for students with dues $> ₹500$.
  - **Record Cash/UPI Payment**: Record offline payments handed directly to mess staff.
  - **Audit Statement**: Open itemized statements showing all historical meal expenses and payments for any student.
  - **Due Reminders**: 1-click dispatch of due payment reminders.
- **Kitchen & Token Verifier Counter**:
  - Live queue of active diners waiting at the counter.
  * Search by token number or student name.
  * 1-click **"Mark as Served / Claimed"** button so tokens cannot be reused.
- **Executive Analytics Overview**:
  - Total Outstanding Mess Dues pending across all hostel students.
  - Total Revenue Collected across all channels.
  - Total Meals Ordered Today and lifetime count.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: Persistent Browser LocalStorage with pre-loaded mock data
- **Typography**: Plus Jakarta Sans

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 👤 Demo Personas
You can test the system using the role switcher and the student persona selector in the top bar:
- **Aarav Sharma**: Active student with pending dues (₹265 across unpaid meals).
- **Priya Patel**: Clean account with ₹450 advance prepaid wallet balance.
- **Rohan Mehta**: High dues defaulter (₹530 dues with alert banner).
- **Sneha Rao**: ₹65 due.
- **Manager Mode**: Instant access to edit menu items, inspect dues, and mark tokens as served.
