import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { getTodayString } from '../utils/date';
import { Plus, Save } from 'lucide-react';
import type { Expense } from '../lib/database.types';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ExpenseForm = ({ expense, onSuccess, onCancel }: ExpenseFormProps) => {
  const { categories, addExpense, updateExpense } = useBudget();
  const [formData, setFormData] = useState({
    date: expense?.date || getTodayString(),
    category_id: expense?.category_id || '',
    amount: expense?.amount.toString() || '',
    description: expense?.description || '',
    payment_method: expense?.payment_method || 'Cash',
    is_recurring: expense?.is_recurring || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    const expenseData = {
      date: formData.date,
      category_id: formData.category_id,
      amount,
      description: formData.description,
      payment_method: formData.payment_method,
      is_recurring: formData.is_recurring,
    };

    const { error: saveError } = expense
      ? await updateExpense(expense.id, expenseData)
      : await addExpense(expenseData);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess(true);
      if (!expense) {
        setFormData({
          date: getTodayString(),
          category_id: '',
          amount: '',
          description: '',
          payment_method: 'Cash',
          is_recurring: false,
        });
      }
      setTimeout(() => setSuccess(false), 3000);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={getTodayString()}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="500.00"
          />
        </div>

        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          placeholder="Add notes about this expense..."
        />
      </div>

      <div className="flex items-center">
        <input
          id="is_recurring"
          type="checkbox"
          checked={formData.is_recurring}
          onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="is_recurring" className="ml-2 text-sm text-gray-700">
          This is a recurring monthly expense
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          Expense {expense ? 'updated' : 'added'} successfully!
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {expense ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
