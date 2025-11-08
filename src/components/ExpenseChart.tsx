import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatCurrency } from '../utils/currency';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  expensesByCategory: Record<string, { total: number; count: number; color: string }>;
  currency: string;
}

export const ExpenseChart = ({ expensesByCategory, currency }: ExpenseChartProps) => {
  const categories = Object.keys(expensesByCategory);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Distribution</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No expenses recorded yet</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat => expensesByCategory[cat].total),
        backgroundColor: categories.map(cat => expensesByCategory[cat].color),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: (chart: ChartJS) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i] as number;
                return {
                  text: `${label}: ${formatCurrency(value, currency)}`,
                  fillStyle: data.datasets[0].backgroundColor?.[i] as string,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: number }) {
            const label = context.label || '';
            const value = context.parsed;
            const categoryData = expensesByCategory[label];
            return [
              `${label}: ${formatCurrency(value, currency)}`,
              `Transactions: ${categoryData.count}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Distribution</h2>
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
