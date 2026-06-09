'use client'

import useSWR from 'swr'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function AnalysisSection() {
  const { data: edaData, isLoading: edaLoading } = useSWR('/api/eda', fetcher)
  const { data: comparisonData, isLoading: modelsLoading } = useSWR('/api/models/comparison', fetcher)

  if (edaLoading || modelsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    )
  }

  const models = comparisonData?.models || []
  const tenureData = edaData?.tenure_analysis || []
  const balanceData = edaData?.balance_analysis || []
  const chargesData = edaData?.monthly_charges_analysis || []
  const genderData = edaData?.gender_analysis || []
  const activeData = edaData?.active_member_analysis || []
  const creditCardData = edaData?.credit_card_analysis || []

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Deep Analysis</h1>
        <p className="text-muted-foreground">Detailed exploration of churn patterns and feature distributions</p>
      </div>

      {/* Tenure Analysis */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Churn Rate by Tenure</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tenureData.map((d: any) => ({ range: d.range, 'Churn Rate': Math.round(d.churn_rate * 100) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="range" stroke="var(--color-foreground)" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip />
            <Bar dataKey="Churn Rate" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">Insight: New customers (low tenure) have significantly higher churn rates, indicating retention challenges in early stages.</p>
      </div>

      {/* Balance Analysis */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Churn Rate by Account Balance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={balanceData.map((d: any) => ({ range: d.range, 'Churn Rate': Math.round(d.churn_rate * 100) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="range" stroke="var(--color-foreground)" />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip />
            <Bar dataKey="Churn Rate" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">Insight: Account balance shows varying churn patterns - customers with moderate balances may need engagement.</p>
      </div>

      {/* Monthly Charges Analysis */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Churn Rate by Monthly Charges</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chargesData.map((d: any) => ({ range: d.range, 'Churn Rate': Math.round(d.churn_rate * 100) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="range" stroke="var(--color-foreground)" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip />
            <Bar dataKey="Churn Rate" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">Insight: Higher monthly charges correlate with increased churn - pricing or value perception may be a factor.</p>
      </div>

      {/* Demographic Insights */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Gender */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Churn by Gender</h3>
          <div className="space-y-3">
            {genderData.map((d: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{d.gender}</span>
                  <span className="text-sm font-semibold text-primary">{Math.round(d.churn_rate * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${d.churn_rate * 100}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{d.churned} of {d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Member */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Active Member Status</h3>
          <div className="space-y-3">
            {activeData.map((d: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{d.is_active ? 'Active' : 'Inactive'}</span>
                  <span className="text-sm font-semibold text-primary">{Math.round(d.churn_rate * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${d.churn_rate * 100}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{d.churned} of {d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Card */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Credit Card Ownership</h3>
          <div className="space-y-3">
            {creditCardData.map((d: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{d.has_credit_card ? 'Has Card' : 'No Card'}</span>
                  <span className="text-sm font-semibold text-primary">{Math.round(d.churn_rate * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${d.churn_rate * 100}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{d.churned} of {d.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Recommendations */}
      <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Recommendations</h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
            <div>
              <span className="font-medium text-foreground">Focus on Early Retention:</span>
              <span className="text-muted-foreground text-sm ml-2">Implement onboarding and engagement programs for customers with tenure &lt; 12 months</span>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
            <div>
              <span className="font-medium text-foreground">Engage Inactive Members:</span>
              <span className="text-muted-foreground text-sm ml-2">Develop win-back campaigns for inactive members - they show 2-3x higher churn</span>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
            <div>
              <span className="font-medium text-foreground">Review Pricing Strategy:</span>
              <span className="text-muted-foreground text-sm ml-2">Analyze value perception for customers with high monthly charges</span>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
            <div>
              <span className="font-medium text-foreground">Cross-sell Opportunities:</span>
              <span className="text-muted-foreground text-sm ml-2">Increase product diversity - single-product customers have higher churn</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
