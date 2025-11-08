import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/currency';
import { formatMonthYear, getCurrentMonth, getCurrentYear } from '../utils/date';
import { ExpenseChart } from './ExpenseChart';
import { SummaryCard } from './SummaryCard';
import { RecentExpenses } from './RecentExpenses';
import { AlertCircle, TrendingDown, TrendingUp, Wallet, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const {
    salary,
    expenses,
    loading,
    totalExpenses,
    remainingBudget,
    dailyAverage,
    budgetPercentage,
    expensesByCategory,
  } = useBudget();

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const getBudgetStatus = () => {
    if (budgetPercentage >= 95) return { color: 'red', icon: AlertCircle, text: 'Critical' };
    if (budgetPercentage >= 80) return { color: 'amber', icon: TrendingDown, text: 'Warning' };
    return { color: 'emerald', icon: TrendingUp, text: 'Healthy' };
  };

  const status = getBudgetStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">{formatMonthYear(currentMonth, currentYear)}</p>
        </div>
        {salary && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${status.color}-100`}>
            <status.icon className={`w-5 h-5 text-${status.color}-600`} />
            <span className={`text-sm font-medium text-${status.color}-700`}>
              {status.text} - {budgetPercentage.toFixed(0)}% Used
            </span>
          </div>
        )}
      </div>

      {!salary ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Wallet className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Set Your Monthly Salary</h2>
          <p className="text-gray-600 mb-4">
            Start tracking your expenses by setting your monthly income first
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Salary"
              value={formatCurrency(salary.amount, salary.currency)}
              icon={DollarSign}
              color="blue"
            />
            <SummaryCard
              title="Total Spent"
              value={formatCurrency(totalExpenses, salary.currency)}
              icon={TrendingDown}
              color="red"
              subtitle={`${expenses.length} transactions`}
            />
            <SummaryCard
              title="Remaining"
              value={formatCurrency(remainingBudget, salary.currency)}
              icon={Wallet}
              color={remainingBudget > 0 ? 'emerald' : 'red'}
              subtitle={`${((remainingBudget / salary.amount) * 100).toFixed(1)}% left`}
            />
            <SummaryCard
              title="Daily Average"
              value={formatCurrency(dailyAverage, salary.currency)}
              icon={TrendingUp}
              color="amber"
              subtitle="Current month"
            />
          </div>

          {budgetPercentage >= 80 && (
            <div className={`bg-${budgetPercentage >= 95 ? 'red' : 'amber'}-50 border border-${budgetPercentage >= 95 ? 'red' : 'amber'}-200 rounded-lg p-4 flex items-start gap-3`}>
              <AlertCircle className={`w-5 h-5 text-${budgetPercentage >= 95 ? 'red' : 'amber'}-600 mt-0.5 flex-shrink-0`} />
              <div>
                <h3 className={`font-semibold text-${budgetPercentage >= 95 ? 'red' : 'amber'}-900 mb-1`}>
                  {budgetPercentage >= 95 ? 'Budget Alert: Critical Level!' : 'Budget Warning'}
                </h3>
                <p className={`text-sm text-${budgetPercentage >= 95 ? 'red' : 'amber'}-700`}>
                  {budgetPercentage >= 95
                    ? `You've spent ${budgetPercentage.toFixed(1)}% of your monthly budget. Only ${formatCurrency(remainingBudget, salary.currency)} remaining.`
                    : `You've used ${budgetPercentage.toFixed(1)}% of your budget. Consider reviewing your spending.`}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart expensesByCategory={expensesByCategory} currency={salary.currency} />
            <RecentExpenses expenses={expenses.slice(0, 8)} currency={salary.currency} />
          </div>
        </>
      )}
    </div>
  );
};
