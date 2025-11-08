import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/currency';
import { formatMonthYear, getCurrentMonth, getCurrentYear } from '../utils/date';
import { Download, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const MonthlyReport = () => {
  const {
    salary,
    expenses,
    totalExpenses,
    remainingBudget,
    budgetPercentage,
    expensesByCategory,
  } = useBudget();

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const exportToCSV = () => {
    if (!expenses.length) return;

    const headers = ['Date', 'Category', 'Amount', 'Description', 'Payment Method'];
    const rows = expenses.map(expense => [
      expense.date,
      expense.category.name,
      expense.amount,
      expense.description || '',
      expense.payment_method,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${currentMonth}-${currentYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Monthly Report</h1>
          <p className="text-gray-600 mt-1">{formatMonthYear(currentMonth, currentYear)}</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            onClick={exportToCSV}
            disabled={!expenses.length}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {!salary ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">Set your monthly salary to view the report</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(salary.amount, salary.currency)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-gray-600">Total Expenses</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpenses, salary.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{expenses.length} transactions</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-5 h-5 ${remainingBudget > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
                <p className={`text-2xl font-bold ${remainingBudget > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(remainingBudget, salary.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((remainingBudget / salary.amount) * 100).toFixed(1)}% of budget
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Budget Usage</p>
                <p className="text-2xl font-bold text-gray-900">{budgetPercentage.toFixed(1)}%</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budgetPercentage >= 95
                        ? 'bg-red-600'
                        : budgetPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h2>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([category, data]) => {
                  const percentage = salary ? (data.total / salary.amount) * 100 : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="font-medium text-gray-900">{category}</span>
                          <span className="text-sm text-gray-500">({data.count} items)</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(data.total, salary.currency)}
                          </p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of budget</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: data.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(expensesByCategory).length === 0 && (
                <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Insights & Recommendations</h2>
            <div className="space-y-3">
              {budgetPercentage >= 95 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">Critical Budget Alert</p>
                    <p className="text-sm text-red-700 mt-1">
                      You've used {budgetPercentage.toFixed(1)}% of your monthly budget. Consider reducing non-essential expenses.
                    </p>
                  </div>
                </div>
              )}
              {budgetPercentage >= 80 && budgetPercentage < 95 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900">Budget Warning</p>
                    <p className="text-sm text-amber-700 mt-1">
                      You've used {budgetPercentage.toFixed(1)}% of your budget. Monitor your spending closely.
                    </p>
                  </div>
                </div>
              )}
              {budgetPercentage < 80 && expenses.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-900">Good Budget Management</p>
                    <p className="text-sm text-emerald-700 mt-1">
                      You're managing your budget well with {budgetPercentage.toFixed(1)}% used. Keep it up!
                    </p>
                  </div>
                </div>
              )}
              {Object.keys(expensesByCategory).length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Top Spending Category</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {Object.entries(expensesByCategory)
                        .sort(([, a], [, b]) => b.total - a.total)[0][0]}{' '}
                      is your highest expense category with{' '}
                      {formatCurrency(
                        Object.entries(expensesByCategory)
                          .sort(([, a], [, b]) => b.total - a.total)[0][1].total,
                        salary.currency
                      )}
                      .
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
