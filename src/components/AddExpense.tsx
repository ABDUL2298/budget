import { Plus } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { formatMonthYear, getCurrentMonth, getCurrentYear } from '../utils/date';

export const AddExpense = () => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Add Expense</h1>
        <p className="text-gray-600 mt-1">{formatMonthYear(currentMonth, currentYear)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Plus className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Record New Expense</h2>
            <p className="text-sm text-gray-600">Track your spending and manage your budget</p>
          </div>
        </div>

        <ExpenseForm />
      </div>
    </div>
  );
};
