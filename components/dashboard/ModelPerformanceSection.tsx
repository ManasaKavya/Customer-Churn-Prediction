'use client'

import useSWR from 'swr'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, LineChart, Line } from 'recharts'
import { Loader2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())
const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)']

export function ModelPerformanceSection() {
  const { data: comparisonData, isLoading, error } = useSWR('/api/models/comparison', fetcher)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading model metrics...</p>
        </div>
      </div>
    )
  }

  if (error || !comparisonData) {
    return (
      <div className="p-8 bg-card border border-border rounded-lg text-center">
        <p className="text-red-500">Failed to load model metrics. Please ensure the backend pipeline has completed.</p>
      </div>
    )
  }

  const models = comparisonData.models || []

  // Prepare data for comparison chart
  const metricsData = models.map((m: any) => ({
    name: m.name.replace(/([A-Z])/g, ' $1').trim(),
    'Accuracy': Math.round(m.metrics.accuracy * 100),
    'Precision': Math.round(m.metrics.precision * 100),
    'Recall': Math.round(m.metrics.recall * 100),
    'F1-Score': Math.round(m.metrics.f1_score * 100),
  }))

  // Best model
  const bestModel = models.reduce((best: any, current: any) =>
    current.metrics.roc_auc > best.metrics.roc_auc ? current : best
  )

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Model Performance</h1>
        <p className="text-muted-foreground">Compare multiple machine learning models and their evaluation metrics</p>
      </div>

      {/* Best Model Card */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg">
        <h3 className="text-sm text-muted-foreground mb-2">Best Performing Model</h3>
        <h2 className="text-2xl font-bold text-foreground mb-4">{bestModel.name}</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-primary">{Math.round(bestModel.metrics.accuracy * 100)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Precision</div>
            <div className="text-2xl font-bold text-primary">{Math.round(bestModel.metrics.precision * 100)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Recall</div>
            <div className="text-2xl font-bold text-primary">{Math.round(bestModel.metrics.recall * 100)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">F1-Score</div>
            <div className="text-2xl font-bold text-primary">{Math.round(bestModel.metrics.f1_score * 100)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">ROC-AUC</div>
            <div className="text-2xl font-bold text-primary">{bestModel.metrics.roc_auc.toFixed(3)}</div>
          </div>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Metrics Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-foreground)" />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Accuracy" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Precision" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Recall" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="F1-Score" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Model Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {models.map((model: any, idx: number) => (
          <div key={model.name} className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold text-foreground mb-6">{model.name}</h3>
            
            {/* Confusion Matrix */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Confusion Matrix</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">True Negative</div>
                  <div className="text-2xl font-bold text-green-500">{model.confusion_matrix[0][0]}</div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">False Positive</div>
                  <div className="text-2xl font-bold text-red-500">{model.confusion_matrix[0][1]}</div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">False Negative</div>
                  <div className="text-2xl font-bold text-red-500">{model.confusion_matrix[1][0]}</div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">True Positive</div>
                  <div className="text-2xl font-bold text-green-500">{model.confusion_matrix[1][1]}</div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-primary">{Math.round(model.metrics.accuracy * 100)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Precision</div>
                <div className="text-2xl font-bold text-primary">{Math.round(model.metrics.precision * 100)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Recall</div>
                <div className="text-2xl font-bold text-primary">{Math.round(model.metrics.recall * 100)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">ROC-AUC</div>
                <div className="text-2xl font-bold text-primary">{model.metrics.roc_auc.toFixed(3)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
