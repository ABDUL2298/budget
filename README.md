# Budget Tracker - Monthly Expense Manager

A comprehensive web application for tracking monthly expenses and managing your budget with real-time visual analytics.

## Features

### Core Functionality
- **Salary Management**: Set and update your monthly income
- **Expense Tracking**: Record daily expenses with categories, descriptions, and payment methods
- **Real-time Dashboard**: Live calculations showing salary, spent amount, remaining budget, and daily averages
- **Interactive Charts**: Pie charts displaying expense distribution by category
- **Budget Alerts**: Automatic warnings at 80% and 95% budget thresholds
- **Expense Management**: Edit and delete expenses with confirmation
- **Monthly Reports**: Detailed insights, category breakdowns, and CSV export functionality

### Technical Features
- **Secure Authentication**: Email/password authentication using Supabase
- **Real-time Updates**: Instant UI updates when data changes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Export**: Export expenses to CSV format
- **Print Support**: Print-optimized monthly reports
- **Form Validation**: Comprehensive input validation and error handling

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js with React wrapper
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (database is already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Usage Guide

### First Time Setup

1. **Create an Account**
   - Open the application
   - Sign up with your email and password
   - You'll be automatically logged in

2. **Set Your Monthly Salary**
   - Navigate to "Salary" in the menu
   - Enter your monthly income amount
   - Select your currency (INR, USD, EUR, GBP)
   - Click "Save Salary"

3. **Add Your First Expense**
   - Click "Add Expense" in the navigation
   - Fill in the expense details:
     - Date (defaults to today)
     - Category (Food, Transport, Bills, etc.)
     - Amount
     - Payment method (Cash, Card, UPI, etc.)
     - Optional description
   - Click "Add Expense"

### Dashboard

The dashboard provides a comprehensive overview of your monthly budget:

- **Summary Cards**: Quick view of total salary, spent amount, remaining budget, and daily average
- **Budget Status Indicator**: Color-coded status (Healthy, Warning, Critical)
- **Expense Distribution Chart**: Interactive pie chart showing spending by category
- **Recent Expenses**: List of your latest transactions

### Managing Expenses

**View All Expenses**:
- Navigate to "All Expenses"
- See a complete table of all transactions
- View total expenses at the bottom

**Edit an Expense**:
- Click the edit icon (pencil) next to any expense
- Modify the details
- Click "Update Expense"

**Delete an Expense**:
- Click the delete icon (trash) next to any expense
- Click "Confirm" to permanently delete

### Monthly Report

Access detailed analytics and insights:

- **Summary Statistics**: Comprehensive budget overview
- **Category Breakdown**: Detailed spending by category with percentage bars
- **Insights & Recommendations**: Smart suggestions based on your spending patterns
- **Export to CSV**: Download your expense data for external analysis
- **Print Report**: Generate a print-friendly version of your report

## Database Schema

### Tables

**categories**
- Predefined expense categories with colors and icons
- Read-only for users

**salary**
- Monthly income records
- One record per user per month/year
- Supports multiple currencies

**expenses**
- Daily expense transactions
- Linked to categories
- Tracks payment methods and descriptions

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic user_id assignment on insert
- Protected from unauthorized access

## Key Features in Detail

### Budget Alerts

The application monitors your spending and provides alerts:

- **80% Threshold**: Warning notification to monitor spending
- **95% Threshold**: Critical alert to reduce non-essential expenses
- **Visual Indicators**: Color-coded budget status throughout the app

### Real-time Calculations

All metrics are calculated in real-time:
- Total expenses
- Remaining budget
- Daily average spending
- Budget percentage used
- Category-wise distribution

### Responsive Design

The application adapts to all screen sizes:
- Desktop: Full navigation and multi-column layouts
- Tablet: Optimized spacing and touch-friendly controls
- Mobile: Hamburger menu and single-column layouts

## Best Practices

1. **Regular Tracking**: Add expenses daily for accurate budgeting
2. **Categorization**: Use appropriate categories for better insights
3. **Descriptions**: Add notes to remember expense details
4. **Monthly Review**: Check the monthly report regularly
5. **Budget Alerts**: Act on warnings to maintain financial health

## Development

### Build for Production
```bash
npm run build
```

### Run Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

## Support

For issues or questions about the application, check the database connection in `.env` and ensure Supabase is properly configured.
