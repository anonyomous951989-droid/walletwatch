import React, { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

/* ── Animated counter hook ── */
const useCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

/* ── Summary Card ── */
const SummaryCard = ({ icon, label, value, gradient, delay }) => {
  const animatedValue = useCounter(Math.abs(value));
  return (
    <div
      className="analytics-summary-card"
      style={{ background: gradient, animationDelay: `${delay}ms` }}
    >
      <div className="asc-icon">{icon}</div>
      <div className="asc-content">
        <span className="asc-label">{label}</span>
        <span className="asc-value">
          ₹ {animatedValue.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="asc-decoration" />
    </div>
  );
};

const CATEGORIES = [
  "Income in Salary",
  "Income in Part Time",
  "Income in Project",
  "Income in Freelancing",
  "Income in Tip",
  "Expense in Stationary",
  "Expense in Food",
  "Expense in Movie",
  "Expense in Biils",
  "Expense in Medical",
  "Expense in Fees",
  "Expense in TAX",
];

const Analytics = ({ allTransection }) => {
  /* ── Computed values ── */
  const stats = useMemo(() => {
    const totalTransaction = allTransection.length;
    const incomeTransactions = allTransection.filter(
      (t) => t.type === "Income"
    );
    const expenseTransactions = allTransection.filter(
      (t) => t.type === "Expense"
    );
    const totalIncome = incomeTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );
    const totalExpense = expenseTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );
    const balance = totalIncome - totalExpense;

    return {
      totalTransaction,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
      totalIncome,
      totalExpense,
      balance,
    };
  }, [allTransection]);

  /* ── Category-wise data ── */
  const categoryData = useMemo(() => {
    const incomeCategories = [];
    const expenseCategories = [];

    CATEGORIES.forEach((cat) => {
      const amount = allTransection
        .filter((t) => t.category === cat)
        .reduce((acc, t) => acc + t.amount, 0);

      if (amount > 0) {
        if (cat.startsWith("Income")) {
          incomeCategories.push({
            name: cat.replace("Income in ", ""),
            amount,
          });
        } else {
          expenseCategories.push({
            name: cat.replace("Expense in ", ""),
            amount,
          });
        }
      }
    });

    return { incomeCategories, expenseCategories };
  }, [allTransection]);

  /* ── Doughnut Chart — Income vs Expense ── */
  const doughnutData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [stats.totalIncome || 0, stats.totalExpense || 0],
        backgroundColor: [
          "rgba(17, 153, 142, 0.85)",
          "rgba(235, 51, 73, 0.85)",
        ],
        hoverBackgroundColor: [
          "rgba(17, 153, 142, 1)",
          "rgba(235, 51, 73, 1)",
        ],
        borderWidth: 0,
        cutout: "72%",
        borderRadius: 6,
        spacing: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 12,
          font: { family: "'Inter', sans-serif", size: 13, weight: "600" },
          color: "#3d3228",
        },
      },
      tooltip: {
        backgroundColor: "rgba(45, 35, 24, 0.92)",
        titleFont: { family: "'Inter', sans-serif", weight: "700" },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ₹ ${ctx.parsed.toLocaleString("en-IN")}`,
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1200,
    },
  };

  /* ── Bar Chart — Category Breakdown ── */
  const allCategoryLabels = [
    ...categoryData.incomeCategories.map((c) => c.name),
    ...categoryData.expenseCategories.map((c) => c.name),
  ];
  const uniqueLabels = [...new Set(allCategoryLabels)];

  const barData = {
    labels:
      uniqueLabels.length > 0
        ? uniqueLabels
        : ["Salary", "Food", "Bills", "Medical"],
    datasets: [
      {
        label: "Income",
        data: uniqueLabels.map((label) => {
          const found = categoryData.incomeCategories.find(
            (c) => c.name === label
          );
          return found ? found.amount : 0;
        }),
        backgroundColor: "rgba(17, 153, 142, 0.75)",
        hoverBackgroundColor: "rgba(17, 153, 142, 1)",
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
      {
        label: "Expense",
        data: uniqueLabels.map((label) => {
          const found = categoryData.expenseCategories.find(
            (c) => c.name === label
          );
          return found ? found.amount : 0;
        }),
        backgroundColor: "rgba(235, 51, 73, 0.75)",
        hoverBackgroundColor: "rgba(235, 51, 73, 1)",
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 12,
          font: { family: "'Inter', sans-serif", size: 12, weight: "600" },
          color: "#3d3228",
        },
      },
      tooltip: {
        backgroundColor: "rgba(45, 35, 24, 0.92)",
        titleFont: { family: "'Inter', sans-serif", weight: "700" },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ₹ ${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: "500" },
          color: "#7a6a5a",
        },
      },
      y: {
        grid: { color: "rgba(236, 222, 206, 0.5)", drawBorder: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#7a6a5a",
          callback: (v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`,
        },
        beginAtZero: true,
      },
    },
    animation: { duration: 1000 },
  };

  /* ── Line/Area Chart — Income vs Expense trend ── */
  const trendData = useMemo(() => {
    const sorted = [...allTransection].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const dateMap = {};
    sorted.forEach((t) => {
      const d = new Date(t.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      if (!dateMap[d]) dateMap[d] = { income: 0, expense: 0 };
      if (t.type === "Income") dateMap[d].income += t.amount;
      else dateMap[d].expense += t.amount;
    });

    const labels = Object.keys(dateMap);
    return {
      labels: labels.length > 0 ? labels : ["No Data"],
      datasets: [
        {
          label: "Income",
          data: labels.map((l) => dateMap[l].income),
          borderColor: "rgba(17, 153, 142, 1)",
          backgroundColor: "rgba(17, 153, 142, 0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(17, 153, 142, 1)",
          pointBorderWidth: 2.5,
          borderWidth: 2.5,
        },
        {
          label: "Expense",
          data: labels.map((l) => dateMap[l].expense),
          borderColor: "rgba(235, 51, 73, 1)",
          backgroundColor: "rgba(235, 51, 73, 0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(235, 51, 73, 1)",
          pointBorderWidth: 2.5,
          borderWidth: 2.5,
        },
      ],
    };
  }, [allTransection]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 12,
          font: { family: "'Inter', sans-serif", size: 12, weight: "600" },
          color: "#3d3228",
        },
      },
      tooltip: {
        backgroundColor: "rgba(45, 35, 24, 0.92)",
        titleFont: { family: "'Inter', sans-serif", weight: "700" },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ₹ ${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: "500" },
          color: "#7a6a5a",
        },
      },
      y: {
        grid: { color: "rgba(236, 222, 206, 0.4)", drawBorder: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#7a6a5a",
          callback: (v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`,
        },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: "index" },
    animation: { duration: 1200 },
  };

  return (
    <div className="analytics-root">
      {/* ── Summary Cards ── */}
      <div className="analytics-summary">
        <SummaryCard
          icon="💰"
          label="Total Balance"
          value={stats.balance}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          delay={0}
        />
        <SummaryCard
          icon="📈"
          label="Total Income"
          value={stats.totalIncome}
          gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
          delay={80}
        />
        <SummaryCard
          icon="📉"
          label="Total Expense"
          value={stats.totalExpense}
          gradient="linear-gradient(135deg, #eb3349 0%, #f45c43 100%)"
          delay={160}
        />
        <SummaryCard
          icon="📊"
          label="Transactions"
          value={stats.totalTransaction}
          gradient="linear-gradient(135deg, #e8722a 0%, #c95a18 100%)"
          delay={240}
        />
      </div>

      {/* ── Charts Grid ── */}
      <div className="analytics-charts-grid">
        {/* Doughnut */}
        <div className="chart-card chart-card--doughnut">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <span className="chart-card-icon">🍩</span>
              Income vs Expense
            </h3>
            <span className="chart-card-badge">Overview</span>
          </div>
          <div className="chart-card-body chart-doughnut-body">
            <div className="doughnut-wrap">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="doughnut-center-label">
                <span className="dcl-amount">
                  ₹ {stats.balance.toLocaleString("en-IN")}
                </span>
                <span className="dcl-sub">Net Balance</span>
              </div>
            </div>
            <div className="doughnut-stats">
              <div className="doughnut-stat ds-income">
                <span className="ds-dot" />
                <div>
                  <span className="ds-label">Income</span>
                  <span className="ds-value">
                    ₹ {stats.totalIncome.toLocaleString("en-IN")}
                  </span>
                  <span className="ds-count">
                    {stats.incomeCount} transactions
                  </span>
                </div>
              </div>
              <div className="doughnut-stat ds-expense">
                <span className="ds-dot" />
                <div>
                  <span className="ds-label">Expense</span>
                  <span className="ds-value">
                    ₹ {stats.totalExpense.toLocaleString("en-IN")}
                  </span>
                  <span className="ds-count">
                    {stats.expenseCount} transactions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Line */}
        <div className="chart-card chart-card--trend">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <span className="chart-card-icon">📈</span>
              Transaction Trend
            </h3>
            <span className="chart-card-badge">Timeline</span>
          </div>
          <div className="chart-card-body" style={{ height: 280 }}>
            <Line data={trendData} options={lineOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card chart-card--bar">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <span className="chart-card-icon">📊</span>
              Category Breakdown
            </h3>
            <span className="chart-card-badge">Categories</span>
          </div>
          <div className="chart-card-body" style={{ height: 300 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Category Cards */}
        <div className="chart-card chart-card--categories">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <span className="chart-card-icon">🏷️</span>
              Category Details
            </h3>
          </div>
          <div className="chart-card-body category-details-body">
            {/* Income Categories */}
            <div className="cat-section">
              <div className="cat-section-header cat-income-header">
                <span className="cat-section-dot cat-income-dot" />
                <span>Income Categories</span>
              </div>
              {categoryData.incomeCategories.length === 0 && (
                <p className="cat-empty">No income data yet</p>
              )}
              {categoryData.incomeCategories.map((cat, i) => (
                <div key={i} className="cat-row">
                  <div className="cat-row-info">
                    <span className="cat-row-name">{cat.name}</span>
                    <span className="cat-row-amount">
                      ₹ {cat.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill cat-bar-income"
                      style={{
                        width: `${(
                          (cat.amount / stats.totalIncome) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    />
                  </div>
                  <span className="cat-row-pct">
                    {((cat.amount / stats.totalIncome) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Expense Categories */}
            <div className="cat-section">
              <div className="cat-section-header cat-expense-header">
                <span className="cat-section-dot cat-expense-dot" />
                <span>Expense Categories</span>
              </div>
              {categoryData.expenseCategories.length === 0 && (
                <p className="cat-empty">No expense data yet</p>
              )}
              {categoryData.expenseCategories.map((cat, i) => (
                <div key={i} className="cat-row">
                  <div className="cat-row-info">
                    <span className="cat-row-name">{cat.name}</span>
                    <span className="cat-row-amount">
                      ₹ {cat.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill cat-bar-expense"
                      style={{
                        width: `${(
                          (cat.amount / stats.totalExpense) *
                          100
                        ).toFixed(0)}%`,
                      }}
                    />
                  </div>
                  <span className="cat-row-pct">
                    {((cat.amount / stats.totalExpense) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
