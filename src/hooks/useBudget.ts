import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Salary, Expense, Category, ExpenseWithCategory } from '../lib/database.types';
import { getCurrentMonth, getCurrentYear, getMonthStartEnd } from '../utils/date';

export const useBudget = (month?: number, year?: number) => {
  const currentMonth = month || getCurrentMonth();
  const currentYear = year || getCurrentYear();

  const [salary, setSalary] = useState<Salary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalary = async () => {
    const { data, error } = await supabase
      .from('salary')
      .select('*')
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .maybeSingle();

    if (error) {
      setError(error.message);
      return null;
    }
    setSalary(data);
    return data;
  };

  const fetchExpenses = async () => {
    const { start, end } = getMonthStartEnd(currentMonth, currentYear);

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        category:categories(*)
      `)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false });

    if (error) {
      setError(error.message);
      return [];
    }

    const expensesWithCategory = (data || []).map(expense => ({
      ...expense,
      category: expense.category as unknown as Category
    })) as ExpenseWithCategory[];

    setExpenses(expensesWithCategory);
    return expensesWithCategory;
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      setError(error.message);
      return [];
    }
    setCategories(data || []);
    return data || [];
  };

  const saveSalary = async (amount: number, currency: string = 'INR') => {
    const { data: existingSalary } = await supabase
      .from('salary')
      .select('id')
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .maybeSingle();

    if (existingSalary) {
      const { data, error } = await supabase
        .from('salary')
        .update({ amount, currency, updated_at: new Date().toISOString() })
        .eq('id', existingSalary.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { data: null, error };
      }
      setSalary(data);
      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from('salary')
        .insert({ month: currentMonth, year: currentYear, amount, currency })
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { data: null, error };
      }
      setSalary(data);
      return { data, error: null };
    }
  };

  const addExpense = async (expense: {
    date: string;
    category_id: string;
    amount: number;
    description?: string;
    payment_method?: string;
    is_recurring?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      setError(error.message);
      return { data: null, error };
    }

    const expenseWithCategory = {
      ...data,
      category: data.category as unknown as Category
    } as ExpenseWithCategory;

    setExpenses(prev => [expenseWithCategory, ...prev]);
    return { data: expenseWithCategory, error: null };
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) {
      setError(error.message);
      return { data: null, error };
    }

    const expenseWithCategory = {
      ...data,
      category: data.category as unknown as Category
    } as ExpenseWithCategory;

    setExpenses(prev => prev.map(e => e.id === id ? expenseWithCategory : e));
    return { data: expenseWithCategory, error: null };
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return { error };
    }

    setExpenses(prev => prev.filter(e => e.id !== id));
    return { error: null };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSalary(),
        fetchExpenses(),
        fetchCategories(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [currentMonth, currentYear]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = (salary?.amount || 0) - totalExpenses;
  const dailyAverage = expenses.length > 0 ? totalExpenses / new Date().getDate() : 0;
  const budgetPercentage = salary?.amount ? (totalExpenses / salary.amount) * 100 : 0;

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const categoryName = expense.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        total: 0,
        count: 0,
        color: expense.category.color,
      };
    }
    acc[categoryName].total += expense.amount;
    acc[categoryName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; color: string }>);

  return {
    salary,
    expenses,
    categories,
    loading,
    error,
    totalExpenses,
    remainingBudget,
    dailyAverage,
    budgetPercentage,
    expensesByCategory,
    saveSalary,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshData: async () => {
      await Promise.all([fetchSalary(), fetchExpenses()]);
    },
  };
};
