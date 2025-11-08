import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { DollarSign, Save } from 'lucide-react';
import { formatMonthYear, getCurrentMonth, getCurrentYear } from '../utils/date';

export const SalaryForm = () => {
  const { salary, saveSalary } = useBudget();
  const [amount, setAmount] = useState(salary?.amount.toString() || '');
  const [currency, setCurrency] = useState(salary?.currency || 'INR');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const amountValue = parseFloat(amount);

    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    const { error: saveError } = await saveSalary(amountValue, currency);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Monthly Salary</h1>
        <p className="text-gray-600 mt-1">{formatMonthYear(currentMonth, currentYear)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {salary ? 'Update Your Salary' : 'Set Your Monthly Salary'}
            </h2>
            <p className="text-sm text-gray-600">
              {salary ? 'Modify your monthly income amount' : 'Enter your monthly income to start tracking expenses'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                placeholder="50000"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
              Salary saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : salary ? 'Update Salary' : 'Save Salary'}
          </button>
        </form>

        {salary && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Current Salary:</span>{' '}
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: salary.currency,
              }).format(salary.amount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
