import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import type { ExpenseWithCategory } from '../lib/database.types';
import { Receipt } from 'lucide-react';

interface RecentExpensesProps {
  expenses: ExpenseWithCategory[];
  currency: string;
}

export const RecentExpenses = ({ expenses, currency }: RecentExpensesProps) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Receipt className="w-12 h-12 mb-2" />
          <p>No expenses recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${expense.category.color}20` }}
              >
                <span className="text-lg" style={{ color: expense.category.color }}>
                  {expense.category.icon || '📌'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{expense.category.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(expense.date)}</span>
                  {expense.description && (
                    <>
                      <span>•</span>
                      <span className="truncate">{expense.description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right ml-3">
              <p className="font-semibold text-gray-900">
                {formatCurrency(expense.amount, currency)}
              </p>
              <p className="text-xs text-gray-500">{expense.payment_method}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
