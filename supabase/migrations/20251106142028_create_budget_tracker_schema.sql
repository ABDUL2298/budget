/*
  # Budget Tracker - Complete Database Schema

  ## Overview
  This migration creates a comprehensive budget tracking system with salary management,
  expense tracking, and category organization capabilities.

  ## 1. New Tables
  
  ### `categories`
  Predefined expense categories with visual styling:
  - `id` (uuid, primary key)
  - `name` (text, unique) - Category name (e.g., Food, Transport)
  - `color` (text) - Hex color code for charts
  - `icon` (text) - Icon identifier for UI
  - `budget_limit` (numeric) - Optional spending limit per category
  - `is_active` (boolean) - Whether category is currently in use
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `salary`
  Monthly salary/income records:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to auth.users
  - `month` (integer) - Month number (1-12)
  - `year` (integer) - Year (e.g., 2025)
  - `amount` (numeric) - Salary amount
  - `currency` (text) - Currency code (default: INR)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `expenses`
  Daily expense tracking records:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to auth.users
  - `date` (date) - Expense date
  - `category_id` (uuid) - Reference to categories table
  - `amount` (numeric) - Expense amount
  - `description` (text) - Optional notes/description
  - `payment_method` (text) - Payment type (Cash, Card, UPI, etc.)
  - `is_recurring` (boolean) - Whether expense repeats monthly
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own salary and expense records
  - Categories table is read-only for all authenticated users
  - Policies enforce user ownership and prevent unauthorized access

  ## 3. Important Notes
  - All monetary amounts use NUMERIC type for precision
  - Timestamps use timestamptz for timezone support
  - Foreign key constraints ensure data integrity
  - Default values minimize required user input
  - Indexes added for performance on common queries
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL,
  icon text,
  budget_limit numeric(10,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create salary table
CREATE TABLE IF NOT EXISTS salary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL CHECK (year >= 2000 AND year <= 2100),
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'INR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  description text DEFAULT '',
  payment_method text DEFAULT 'Cash',
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (read-only for all authenticated users)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for salary
CREATE POLICY "Users can view own salary records"
  ON salary FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own salary records"
  ON salary FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own salary records"
  ON salary FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own salary records"
  ON salary FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_salary_user_month ON salary(user_id, month, year);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);

-- Insert default categories with colors and icons
INSERT INTO categories (name, color, icon) VALUES
  ('Food', '#FF6384', 'utensils'),
  ('Transport', '#36A2EB', 'car'),
  ('Bills', '#FFCE56', 'file-text'),
  ('Shopping', '#4BC0C0', 'shopping-bag'),
  ('Entertainment', '#9966FF', 'film'),
  ('Healthcare', '#FF9F40', 'heart'),
  ('Education', '#C9CBCF', 'book'),
  ('Other', '#77DD77', 'more-horizontal')
ON CONFLICT (name) DO NOTHING;