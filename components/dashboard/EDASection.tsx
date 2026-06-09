'use client'

import useSWR from 'swr'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Loader2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function EDASection() {
  const { data: edaData, isLoading, error } = useSWR('/api/eda', fetcher)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading EDA analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !edaData) {
    return (
      <div className="p-8 bg-card border border-border rounded-lg text-center">
        <p className="text-red-500">Failed to load EDA data. Please ensure the backend pipeline has completed.</p>
      </div>
    )
  }

  const churnData = [
    { name: 'Retained', value: edaData.churn_distribution.retained, fill: '#22c55e' },
    { name: 'Churned', value: edaData.churn_distribution.churned, fill: '#ef4444' }
  ]

  const countryData = (edaData.country_analysis || []).map((d: any) => ({
    name: d.country,
    'Churn Rate': Math.round(d.churn_rate * 100),
    count: d.count
  }))

  const ageData = (edaData.age_analysis || []).map((d: any) => ({
    range: d.range,
    'Churn Rate': Math.round(d.churn_rate * 100),
    count: d.count
  }))

  const correlations = edaData.churn_correlations || {}

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Exploratory Data Analysis</h1>
        <p className="text-muted-foreground">Comprehensive analysis of customer behavior and churn patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Total Customers</div>
          <div className="text-3xl font-bold text-primary">
            {(edaData.churn_distribution.retained + edaData.churn_distribution.churned).toLocaleString()}
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Churn Rate</div>
          <div className="text-3xl font-bold text-red-500">
            {Math.round(edaData.churn_distribution.churn_rate * 100)}%
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Churned Customers</div>
          <div className="text-3xl font-bold text-red-500">
            {edaData.churn_distribution.churned.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Churn Distribution Pie Chart */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-4">Churn Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={churnData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                {churnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Churn by Country */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold text-foreground mb-4">Churn Rate by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip />
              <Bar dataKey="Churn Rate" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Churn by Age Group */}
        <div className="p-6 bg-card border border-border rounded-lg lg:col-span-2">
          <h2 className="text-xl font-semibold text-foreground mb-4">Churn Rate by Age Group</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="range" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip />
              <Line type="monotone" dataKey="Churn Rate" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ fill: 'var(--color-primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Correlations */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Feature Correlations with Churn</h2>
        <div className="space-y-3">
          {Object.entries(correlations).map(([feature, correlation]: [string, any]) => (
            <div key={feature} className="flex items-center justify-between">
              <span className="text-foreground font-medium">{feature}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${correlation > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.abs(correlation) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-semibold w-12 text-right ${correlation > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {correlation.toFixed(3)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
